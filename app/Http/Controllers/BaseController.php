<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\View;

class BaseController extends Controller {

    public function __construct()
    {
        //To get in response Controller Class Name
        header('Controller: ' . get_class($this));
    }

    /**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}

}
