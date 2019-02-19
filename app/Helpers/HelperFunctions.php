<?php
/**
 * Created by PhpStorm.
 * User: Marcin Wojcik
 * Date: 2/19/19
 * Time: 9:45 AM
 */

if (!function_exists('loadValueFromFile')) {
    /**
     * @param string $environment
     * @return bool|string
     */
    function loadValueFromFile(string $environment)
    {

        $version = 'version_placeholder';

        if (!$environment) {
            return $version;
        }

        $fileName = './../.git/refs/heads/' . $environment;

        if (file_exists($fileName)) {
            $long = file_get_contents('./../.git/refs/heads/' . $environment);
            if ($long) {
                $version = substr($long, 0, 7);
            }
        }

        return $version;
    }
}