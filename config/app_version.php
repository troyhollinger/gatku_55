<?php
/**
 * Created by PhpStorm.
 * User: Marcin Wojcik
 * Date: 6/28/18
 * Time: 5:24 AM
 */


/**
 * Get proper version based on environment: production, QA, dev
 */

$app_env = env('APP_ENV', 'default');

switch ($app_env) {
    case 'production':
        $version = loadValueFromFile('master' );
        break;
    case 'QA':
        $version = loadValueFromFile('QA' );
        break;
    case 'dev':
        $version = 'dev-' . microtime(true);
        break;
    default:
        $version = loadValueFromFile('default');
}

return [
    'version' => $version
];