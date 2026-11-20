<?php
/**
 * PayPal IPN (Instant Payment Notification) & Webhook Handler for Lorica
 * Listens for incoming donations, records them, and sends email notifications.
 */

header('Content-Type: application/json');

$configFile = __DIR__ . '/config.json';
$donationsFile = __DIR__ . '/donations.json';

// Default config
$config = [
    'admin_password' => 'XydrisLorica@2026',
    'notification_email' => 'admin@xydris.in',
    'paypal_email' => '',
    'paypal_client_id' => '',
    'paypal_mode' => 'sandbox', // 'sandbox' or 'live'
    'paypal_donation_link' => '',
    'email_notifications_enabled' => true
];

if (file_exists($configFile)) {
    $loaded = json_decode(file_get_contents($configFile), true);
    if (is_array($loaded)) {
        $config = array_merge($config, $loaded);
    }
}

// Read raw POST data
$rawPostData = file_get_contents('php://input');
$rawPostArray = explode('&', $rawPostData);
$myPost = array();
foreach ($rawPostArray as $keyval) {
    $keyval = explode('=', $keyval);
    if (count($keyval) == 2) {
        $myPost[$keyval[0]] = urldecode($keyval[1]);
    }
}

// Read JSON payload if IPN is JSON (PayPal Webhooks)
$jsonData = json_decode($rawPostData, true);

$amount = 0;
$currency = 'USD';
$payerEmail = 'Anonymous Supporter';
$payerName = 'Anonymous';
$txnId = 'TXN_' . time();
$status = 'Completed';
$tier = 'Pay It Forward Benefactor';

if ($jsonData && isset($jsonData['event_type'])) {
    // PayPal Webhook Format
    $eventType = $jsonData['event_type'];
    $resource = $jsonData['resource'] ?? [];
    $amount = $resource['amount']['value'] ?? ($resource['amount']['total'] ?? 0);
    $currency = $resource['amount']['currency'] ?? 'USD';
    $payerEmail = $resource['payer']['email_address'] ?? ($resource['subscriber']['email_address'] ?? 'Anonymous Supporter');
    $payerName = ($resource['payer']['name']['given_name'] ?? '') . ' ' . ($resource['payer']['name']['surname'] ?? '');
    $txnId = $resource['id'] ?? ('WH_' . time());
    $status = $resource['status'] ?? 'Completed';
} elseif (!empty($myPost)) {
    // Classic PayPal IPN Format
    $amount = $myPost['mc_gross'] ?? ($myPost['payment_gross'] ?? 0);
    $currency = $myPost['mc_currency'] ?? 'USD';
    $payerEmail = $myPost['payer_email'] ?? 'Anonymous';
    $payerName = ($myPost['first_name'] ?? '') . ' ' . ($myPost['last_name'] ?? '');
    $txnId = $myPost['txn_id'] ?? ('IPN_' . time());
    $status = $myPost['payment_status'] ?? 'Completed';
    $tier = $myPost['item_name'] ?? 'Pay It Forward Benefactor';
} else {
    // Direct capture from frontend SDK
    $clientInput = json_decode(file_get_contents('php://input'), true);
    if ($clientInput && isset($clientInput['amount'])) {
        $amount = $clientInput['amount'];
        $currency = $clientInput['currency'] ?? 'USD';
        $payerEmail = $clientInput['payerEmail'] ?? 'Supporter';
        $payerName = $clientInput['payerName'] ?? 'Benefactor';
        $tier = $clientInput['tier'] ?? 'Guardian Benefactor';
        $txnId = $clientInput['orderId'] ?? ('ORDER_' . time());
    }
}

if ($amount > 0) {
    // 1. Record Donation
    $donations = [];
    if (file_exists($donationsFile)) {
        $donations = json_decode(file_get_contents($donationsFile), true) ?: [];
    }

    $newDonation = [
        'id' => uniqid('don_'),
        'txn_id' => $txnId,
        'amount' => floatval($amount),
        'currency' => strtoupper($currency),
        'tier' => $tier,
        'payer_name' => trim($payerName) ?: 'Anonymous Benefactor',
        'payer_email' => $payerEmail,
        'status' => $status,
        'created_at' => date('Y-m-d H:i:s'),
        'source' => 'PayPal'
    ];

    array_unshift($donations, $newDonation);
    file_put_contents($donationsFile, json_encode($donations, JSON_PRETTY_PRINT));

    // 2. Send Email Notification
    if (!empty($config['notification_email']) && !empty($config['email_notifications_enabled'])) {
        $to = $config['notification_email'];
        $subject = "🕊️ [Lorica Alert] New Sacred Donation Received: " . $currency . " " . number_format($amount, 2);
        
        $message = "Ave Maria!\n\n";
        $message .= "A new Pay-It-Forward donation has just been received on Lorica.\n\n";
        $message .= "==========================================\n";
        $message .= "Amount: " . $currency . " " . number_format($amount, 2) . "\n";
        $message .= "Benefactor Name: " . $newDonation['payer_name'] . "\n";
        $message .= "Benefactor Email: " . $newDonation['payer_email'] . "\n";
        $message .= "Tier / Devotion: " . $tier . "\n";
        $message .= "Transaction ID: " . $txnId . "\n";
        $message .= "Status: " . $status . "\n";
        $message .= "Date & Time: " . date('Y-m-d H:i:s T') . "\n";
        $message .= "==========================================\n\n";
        $message .= "This donation has been recorded in the hidden Admin Portal.\n";
        $message .= "Log into your Lorica Admin Portal to review all benefactor records.\n\n";
        $message .= "In Christ,\nLorica Benefactor System (Xydris.in)";

        $headers = "From: Lorica Sanctuary <noreply@loricaprayers.com>\r\n";
        $headers .= "Reply-To: " . $newDonation['payer_email'] . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        @mail($to, $subject, $message, $headers);
    }

    echo json_encode(['status' => 'success', 'message' => 'Donation recorded successfully', 'donation' => $newDonation]);
    exit;
}

echo json_encode(['status' => 'ignored', 'message' => 'No active transaction data detected']);
