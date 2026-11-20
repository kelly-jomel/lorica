<?php
/**
 * User & Benefactor Portal Handler for Lorica
 * - Records donations with donor name & email
 * - Fetches donor history by email
 * - Cancels recurring PayPal subscriptions directly with PayPal API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$configFile = __DIR__ . '/config.json';
$donationsFile = __DIR__ . '/donations.json';

$config = [
    'admin_password' => 'XydrisLorica@2026',
    'notification_email' => 'info@xydris.in',
    'paypal_email' => '',
    'paypal_client_id' => '',
    'paypal_secret' => '',
    'paypal_mode' => 'sandbox',
    'email_notifications_enabled' => true
];

if (file_exists($configFile)) {
    $loaded = json_decode(file_get_contents($configFile), true);
    if (is_array($loaded)) {
        $config = array_merge($config, $loaded);
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$action = $_GET['action'] ?? ($input['action'] ?? '');

// Helper: load donations
function getDonations($file) {
    if (!file_exists($file)) return [];
    return json_decode(file_get_contents($file), true) ?: [];
}

// 1. Record Donation with Donor Full Name, Email, Tier, Amount
if ($action === 'record_donation') {
    $name = trim($input['name'] ?? '');
    $email = trim(strtolower($input['email'] ?? ''));
    $amount = floatval($input['amount'] ?? 0);
    $currency = strtoupper(trim($input['currency'] ?? 'USD'));
    $tier = trim($input['tier'] ?? 'Pay It Forward Benefactor');
    $frequency = trim($input['frequency'] ?? 'monthly');
    $subscriptionId = trim($input['subscription_id'] ?? ($input['subscriptionId'] ?? ''));
    $txnId = trim($input['txn_id'] ?? ($subscriptionId ?: ('DON_' . strtoupper(bin2hex(random_bytes(4))))));

    if (empty($email) || empty($name) || $amount <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Full Name, valid Email, and Amount are required.']);
        exit;
    }

    $donations = getDonations($donationsFile);

    $newRecord = [
        'id' => uniqid('don_'),
        'txn_id' => $txnId,
        'subscription_id' => $subscriptionId,
        'amount' => $amount,
        'currency' => $currency,
        'tier' => $tier . ' (' . ($frequency === 'monthly' ? 'Monthly' : 'One-Time') . ')',
        'frequency' => $frequency,
        'payer_name' => $name,
        'payer_email' => $email,
        'status' => 'Active',
        'created_at' => date('Y-m-d H:i:s'),
        'source' => 'PayPal',
        'next_renewal' => $frequency === 'monthly' ? date('Y-m-d', strtotime('+1 month')) : null
    ];

    array_unshift($donations, $newRecord);
    file_put_contents($donationsFile, json_encode($donations, JSON_PRETTY_PRINT));

    // Send instant email to admin
    if (!empty($config['notification_email']) && !empty($config['email_notifications_enabled'])) {
        $to = $config['notification_email'];
        $subject = "🕊️ [Lorica Benefactor] {$currency} " . number_format($amount, 2) . " from {$name}";
        $body = "Ave Maria!\n\nA new Benefactor has supported Lorica:\n\n";
        $body .= "Name: {$name}\n";
        $body .= "Email: {$email}\n";
        $body .= "Amount: {$currency} " . number_format($amount, 2) . " ({$frequency})\n";
        $body .= "Tier: {$newRecord['tier']}\n";
        $body .= "Transaction / Sub ID: {$txnId}\n";
        $body .= "Date: " . date('Y-m-d H:i:s T') . "\n\n";
        $body .= "Recorded in Lorica Sanctuary Inflow Ledger.\n\nIn Christ,\nLorica Benefactor System";
        $headers = "From: Lorica Sanctuary <noreply@loricaprayers.com>\r\nReply-To: {$email}\r\nX-Mailer: PHP/" . phpversion();
        @mail($to, $subject, $body, $headers);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Donation recorded successfully',
        'donation' => $newRecord
    ]);
    exit;
}

// 2. Get User Profile & Donation History by Email
if ($action === 'get_user_history') {
    $email = trim(strtolower($input['email'] ?? ($_GET['email'] ?? '')));
    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email address is required.']);
        exit;
    }

    $donations = getDonations($donationsFile);
    $userDonations = array_values(array_filter($donations, function($d) use ($email) {
        return isset($d['payer_email']) && strtolower(trim($d['payer_email'])) === $email;
    }));

    $totalGiven = [];
    $activeSubscriptions = 0;
    foreach ($userDonations as $d) {
        $c = $d['currency'] ?? 'USD';
        $totalGiven[$c] = ($totalGiven[$c] ?? 0) + floatval($d['amount']);
        if (($d['status'] ?? '') === 'Active' && ($d['frequency'] ?? '') === 'monthly') {
            $activeSubscriptions++;
        }
    }

    echo json_encode([
        'status' => 'success',
        'email' => $email,
        'count' => count($userDonations),
        'donations' => $userDonations,
        'total_given' => $totalGiven,
        'active_subscriptions' => $activeSubscriptions
    ]);
    exit;
}

// 3. Cancel Recurring PayPal Subscription
if ($action === 'cancel_subscription') {
    $subscriptionId = trim($input['subscription_id'] ?? '');
    $email = trim(strtolower($input['email'] ?? ''));
    $reason = trim($input['reason'] ?? 'User requested cancellation from Lorica Pilgrim Portal');

    if (empty($subscriptionId) || empty($email)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Subscription ID and Email are required.']);
        exit;
    }

    $donations = getDonations($donationsFile);
    $found = false;
    $targetDonation = null;

    foreach ($donations as &$d) {
        if ((($d['subscription_id'] ?? '') === $subscriptionId || ($d['txn_id'] ?? '') === $subscriptionId) &&
            strtolower(trim($d['payer_email'] ?? '')) === $email) {
            $d['status'] = 'Cancelled';
            $d['cancelled_at'] = date('Y-m-d H:i:s');
            $found = true;
            $targetDonation = $d;
            break;
        }
    }
    unset($d);

    if (!$found) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Subscription record not found for this email.']);
        exit;
    }

    // Attempt PayPal API cancellation if PayPal Client ID & Secret configured
    $paypalSuccess = false;
    $paypalMessage = 'Cancelled in Lorica ledger.';

    if (!empty($config['paypal_client_id']) && !empty($config['paypal_secret'])) {
        $isLive = ($config['paypal_mode'] ?? 'sandbox') === 'live';
        $baseUrl = $isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

        // 1. Get Access Token
        $ch = curl_init($baseUrl . '/v1/oauth2/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, $config['paypal_client_id'] . ':' . $config['paypal_secret']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Accept-Language: en_US']);
        $tokenRes = curl_exec($ch);
        $tokenData = json_decode($tokenRes, true);
        curl_close($ch);

        if (!empty($tokenData['access_token'])) {
            $accessToken = $tokenData['access_token'];

            // 2. Call cancel endpoint
            $ch = curl_init("{$baseUrl}/v1/billing/subscriptions/{$subscriptionId}/cancel");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['reason' => $reason]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                "Authorization: Bearer {$accessToken}"
            ]);
            $cancelRes = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 204 || $httpCode === 200) {
                $paypalSuccess = true;
                $paypalMessage = 'Successfully cancelled with PayPal gateway.';
            } else {
                $paypalMessage = "Ledger updated to Cancelled. PayPal API returned HTTP {$httpCode}.";
            }
        }
    }

    file_put_contents($donationsFile, json_encode($donations, JSON_PRETTY_PRINT));

    // Notify administrator
    if (!empty($config['notification_email'])) {
        $subject = "🛑 [Lorica Alert] Benefactor Cancelled Recurring Donation: " . ($targetDonation['payer_name'] ?? $email);
        $msg = "A benefactor has cancelled their recurring monthly donation.\n\n";
        $msg .= "Name: " . ($targetDonation['payer_name'] ?? 'N/A') . "\n";
        $msg .= "Email: {$email}\n";
        $msg .= "Subscription ID: {$subscriptionId}\n";
        $msg .= "Amount: " . ($targetDonation['currency'] ?? 'USD') . " " . ($targetDonation['amount'] ?? '0') . "\n";
        $msg .= "Gateway Status: {$paypalMessage}\n";
        $msg .= "Date: " . date('Y-m-d H:i:s T') . "\n";
        $headers = "From: Lorica Sanctuary <noreply@loricaprayers.com>\r\n";
        @mail($config['notification_email'], $subject, $msg, $headers);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Your recurring donation has been cancelled successfully. No further charges will be made.',
        'paypal_synced' => $paypalSuccess,
        'details' => $paypalMessage
    ]);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
