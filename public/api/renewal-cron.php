<?php
/**
 * Automated 7-Day Renewal Reminder Engine for Lorica
 * Scans recurring benefactor records and dispatches a courtesy reminder
 * email 7 days before their scheduled monthly donation renewal.
 *
 * Can be run via Hostinger cPanel Cron Job daily (e.g. 0 0 * * * /usr/bin/php /home/.../public_html/api/renewal-cron.php)
 * or triggered on-demand via the Admin Portal.
 */

header('Content-Type: application/json');

$configFile = __DIR__ . '/config.json';
$donationsFile = __DIR__ . '/donations.json';
$logFile = __DIR__ . '/renewal_logs.json';

// Load config
$config = [
    'admin_password' => 'XydrisLorica@2026',
    'notification_email' => 'admin@xydris.in',
    'email_notifications_enabled' => true,
    'reminder_days_before' => 7
];

if (file_exists($configFile)) {
    $loaded = json_decode(file_get_contents($configFile), true);
    if (is_array($loaded)) {
        $config = array_merge($config, $loaded);
    }
}

// Security: allow CLI execution OR authenticated HTTP request with ?key=XydrisLorica@2026 or admin password
$isCLI = (php_sapi_name() === 'cli');
$providedKey = $_GET['key'] ?? ($_POST['key'] ?? '');
if (!$isCLI && $providedKey !== $config['admin_password']) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized cron execution']);
    exit;
}

$donations = file_exists($donationsFile) ? (json_decode(file_get_contents($donationsFile), true) ?: []) : [];
$renewalLogs = file_exists($logFile) ? (json_decode(file_get_contents($logFile), true) ?: []) : [];

$now = time();
$daysNotice = intval($config['reminder_days_before'] ?? 7);
$targetNoticeSeconds = $daysNotice * 86400; // 7 days in seconds

$remindersSent = 0;
$skipped = 0;
$processedLog = [];

foreach ($donations as &$donation) {
    // Only check active recurring / monthly subscriptions
    $isRecurring = isset($donation['tier']) && (stripos($donation['tier'], 'month') !== false || stripos($donation['tier'], '/mo') !== false);
    if (!$isRecurring || empty($donation['payer_email']) || $donation['payer_email'] === 'Anonymous') {
        $skipped++;
        continue;
    }

    // Determine next renewal date (default: 30 days after creation, or calculated next_billing_date)
    $createdAtTimestamp = strtotime($donation['created_at']);
    if (!$createdAtTimestamp) continue;

    // Calculate the next upcoming monthly anniversary date
    $currentCycleMonth = date('Y-m');
    $billingDay = intval(date('d', $createdAtTimestamp));
    
    // Construct next renewal date for current or upcoming month
    $candidateRenewal = strtotime(date("Y-m-{$billingDay}"));
    if ($candidateRenewal < $now) {
        $candidateRenewal = strtotime("+1 month", $candidateRenewal);
    }

    $timeUntilRenewal = $candidateRenewal - $now;
    $daysRemaining = round($timeUntilRenewal / 86400);

    // If within the target reminder window (between 6.5 and 7.5 days, or exactly <= 7 days and not yet notified this cycle)
    $cycleKey = date('Y-m', $candidateRenewal) . '_' . $donation['id'];

    if ($daysRemaining >= 6 && $daysRemaining <= 7 && !in_array($cycleKey, $renewalLogs)) {
        // Prepare and dispatch reminder email to benefactor
        $to = $donation['payer_email'];
        $subject = "🕊️ [Lorica] Your Monthly Prayer Sponsorship Renews in 7 Days";

        $formattedRenewalDate = date('F j, Y', $candidateRenewal);
        $amountFormatted = ($donation['currency'] ?? 'USD') . ' ' . number_format($donation['amount'] ?? 15, 2);

        $msg = "Ave Maria, " . ($donation['payer_name'] ?: 'Faithful Benefactor') . "!\n\n";
        $msg .= "This is a courtesy reminder regarding your monthly Pay-It-Forward sponsorship for Lorica.\n\n";
        $msg .= "==================================================\n";
        $msg .= "Sponsorship Devotion: " . $donation['tier'] . "\n";
        $msg .= "Renewal Amount: " . $amountFormatted . " / month\n";
        $msg .= "Next Scheduled Renewal: " . $formattedRenewalDate . " (in 7 days)\n";
        $msg .= "Transaction Ref: " . ($donation['txn_id'] ?? 'N/A') . "\n";
        $msg .= "==================================================\n\n";
        $msg .= "WHY THIS SPONSORSHIP MATTERS:\n";
        $msg .= "Because of your generosity, 18,000+ souls are able to pray the Holy Rosary, seek protection under Psalm 91, and complete 9-day Novenas completely free without paywalls or distracting commercial advertisements.\n\n";
        $msg .= "In grateful thanksgiving for your covenant, a monthly Holy Mass continues to be offered for you and your family's intentions.\n\n";
        $msg .= "MANAGING YOUR SUBSCRIPTION:\n";
        $msg .= "If you wish to keep your sponsorship active, no action is required on your part. Your contribution will be processed automatically on {$formattedRenewalDate}.\n\n";
        $msg .= "If your circumstances have changed or you wish to pause or cancel your recurring contribution, you can do so anytime with one click directly inside your PayPal account under 'Automatic Payments' or by replying directly to this email.\n\n";
        $msg .= "Thank you for guarding the sanctuary and paying it forward.\n\n";
        $msg .= "In Christ and Our Lady of Sorrows,\n";
        $msg .= "The Lorica Team • Designed & Maintained by Xydris (https://xydris.in)";

        $headers = "From: Lorica Sanctuary <noreply@loricaprayers.com>\r\n";
        $headers .= "Reply-To: " . ($config['notification_email'] ?? 'admin@xydris.in') . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        $sent = @mail($to, $subject, $msg, $headers);

        if ($sent) {
            $remindersSent++;
            $renewalLogs[] = $cycleKey;
            $processedLog[] = [
                'benefactor' => $donation['payer_name'],
                'email' => $to,
                'renewal_date' => $formattedRenewalDate,
                'status' => 'Email Dispatched'
            ];
        }
    }
}

// Save updated logs
file_put_contents($logFile, json_encode($renewalLogs, JSON_PRETTY_PRINT));

echo json_encode([
    'status' => 'success',
    'timestamp' => date('Y-m-d H:i:s T'),
    'reminders_sent' => $remindersSent,
    'skipped' => $skipped,
    'details' => $processedLog
]);
