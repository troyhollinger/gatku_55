<?php
namespace Gatku\Repositories;

use Gatku\Model\YouImage;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ImageRepository
{
    /**
     * @param $file
     * @param $directory
     * @param null $thumbDirectory
     * @return array|bool
     */
	public function upload($file, $directory, $thumbDirectory = null)
	{
		$response = [];

		try {
			$image = $file->getRealPath();
			$imageName = $file->getClientOriginalName();
			// remove spaces
			$imageName = preg_replace('/\s+/', '', $imageName);
			// prepend random string of numbers to image name
			$imageName = mt_rand(1,999999999) . $imageName;
			$imagePath = public_path() . '/' . $directory . $imageName;

			if ($thumbDirectory !== null) {
				$thumbPath = public_path() . '/' . $thumbDirectory . $imageName;
			}

			// Check if image is a JPG : exif_read_data won't work on anything else.
			if (exif_imagetype($file) == 2) {

			    //Added @ before exif_read_data($file) is workaround only. Need to fix it permanently
                //See: https://github.com/FriendsOfCake/cakephp-upload/issues/221
				$exif = @exif_read_data($file);

				if (isset($exif['Orientation'])) {

					$orientation = $exif['Orientation'];

					$rotateImage = imagecreatefromJPEG($image);

					switch ($orientation) {

						case 3:
					    	$parsedImage = imagerotate($rotateImage, 180, 0);
					      	break;
						case 6:
					    	$parsedImage = imagerotate($rotateImage, -90, 0);
					      	break;
					   case 8:
				      		$parsedImage = imagerotate($rotateImage, 90, 0);
					      	break;
					    default :
					    	$parsedImage = $rotateImage;
					}
				} else {
					$parsedImage = $image;
				}

			} else {
				$parsedImage = $image;
			}

			\Image::make($parsedImage)->save($imagePath);

			if ($thumbDirectory !== null) {
				\Image::make($parsedImage)->resize('45',null, function($constraint){ $constraint->aspectRatio();})->save($thumbPath);
			}

		} catch(Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		$response['imagePath'] = asset($directory .  $imageName);

		if ($thumbDirectory !== null) {
			$response['thumbPath'] = asset($thumbDirectory .  $imageName);
		}
		return $response;
	}

	public function all()
	{
		$photos = glob( public_path() .'img/uploads/*.*');
		return $photos;
	}

    /**
     * Remove the specified resource from storage.
     * DELETE /youimage/{id}
     *
     * @param  int  $id
     * @return boolean
     */
    public function delete(int $id)
    {
        try {
            $discount = YouImage::findOrFail($id);
            $discount->delete();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }

        return true;
    }
}