<?php
// PHP Router for Lorica to handle Content-Negotiation, RFC 8288 Link headers, real 404s, and static files.

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Special route for robots.txt to bypass CDN stale cache and ensure real-time Content-Signal delivery
if ($uri === '/robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
    if (file_exists(__DIR__ . '/robots.txt')) {
        readfile(__DIR__ . '/robots.txt');
    } else {
        echo "User-agent: *\nContent-Signal: search=yes, ai-train=no\nAllow: /\n";
    }
    exit;
}

// 1. Link Header for all HTML/text responses
header('Link: <https://loricaprayers.com/llms.txt>; rel="describedby"; type="text/plain", <https://loricaprayers.com/llms-full.txt>; rel="alternate"; type="text/markdown"');

// 2. Content Negotiation for Markdown: If client asks for text/markdown on the root or homepage
$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if (($uri === '/' || $uri === '/index.html' || $uri === '') && (strpos($accept, 'text/markdown') !== false)) {
    header('Content-Type: text/markdown; charset=utf-8');
    if (file_exists(__DIR__ . '/llms-full.txt')) {
        readfile(__DIR__ . '/llms-full.txt');
    } else {
        readfile(__DIR__ . '/llms.txt');
    }
    exit;
}

// 3. Serve direct static files if they exist
$filePath = __DIR__ . $uri;

if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    // Determine proper content type
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimes = [
        'txt' => 'text/plain; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'html' => 'text/html; charset=utf-8',
        'xml' => 'application/xml; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'js' => 'application/javascript; charset=utf-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'ico' => 'image/x-icon',
        'svg' => 'image/svg+xml',
        'mp3' => 'audio/mpeg',
        'm4a' => 'audio/mp4',
        'ogg' => 'audio/ogg',
        'wav' => 'audio/wav',
    ];
    if (isset($mimes[$ext])) {
        header('Content-Type: ' . $mimes[$ext]);
    }
    readfile($filePath);
    exit;
}

// Check if directory has index.html
if (is_dir($filePath) && file_exists($filePath . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($filePath . '/index.html');
    exit;
}

// 4. If request is for root or known SPA routes, serve index.html with 200
$validSpaRoutes = [
    '/',
    '/index.html',
    '/treasury',
    '/novenas',
    '/warfare',
    '/portal',
    '/my-portal',
    '/profile',
    '/admin'
];

if (in_array(rtrim($uri, '/'), $validSpaRoutes) || $uri === '' || $uri === '/') {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}

// 5. For any genuinely missing pages/routes, return a REAL HTTP 404
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
if (file_exists(__DIR__ . '/404.html')) {
    readfile(__DIR__ . '/404.html');
} else {
    echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested URL was not found on this server.</p></body></html>';
}
exit;
