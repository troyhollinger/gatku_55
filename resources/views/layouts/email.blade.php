<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.3c.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale= 1.0"/>
		<title>EMail Template</title>
		<style>
		* {
			-webkit-margin-before: 0em;
			-webkit-margin-after: 0em;
		}
		body, #body-table, #body-cell {
			height:100% !important;
			margin:0;
			padding:20px;
			/*width:100% !important;*/
		}
		table {
			border-collapse: collapse;
		}
		img, a img {
			border:0;
			outline:none;
			text-decoration;
		}
		h1, h2, h3, h4 ,h5, h6 {
			margin:0;
			padding:0;
		}

		/*///////// CLIENT SPECIFIC STYLES ////////*/
		.ReadMsgBody{ width:100%;}  /*Force Hotmail/Outlook.com to display emails at full width.*/
		.ExternalClass { width:100%;} /*Force Hotmail/Outlook.com to display emails at full width.*/

		.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{ line-height:100%;} /*Force Hotmail/ Outlook.com to display line heights normally.*/
		table, td {
			mso-table-lspace: 0pt; /* Remove spacing between tables in Outlook 2007 and up */
			mso-table-rspace: 0pt; /* Remove spacing between tables in Outlook 2007 and up */
		}
		#outlook a { padding:0;} /* Force Outlook 2007 and up to provide a "view in browser" message */
		img { -ms-interpolation-mode: bicubic;} /* Force IE to smoothly render resized images */
		body, table, td, p, a, li, blockquote, {
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%; /* Prevent Windows and Webkit based mobile platforms from changing declared text sizes. */
		}

		/*////////// GENERAL STYLES //////////*/



		/*////////// MOBILE STYLES //////////*/
		@media only screen and (max-width: 480px) {
			body{ 
				width:100% !important;
				min-width:100% !important;
			} /*Force iOS Mail to render the email at full width*/
		}


		</style>
	</head>	
	<body style="padding:20px;">
		
		@yield('content')

	</body>
</html>