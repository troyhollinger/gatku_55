<?php

use Illuminate\Database\Seeder;
use Gatku\Product;

class ProductsTableSeeder extends Seeder {

	public function run() {

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 2, 
			'attachedImage' => asset('img/full-size/signature-paralyzer-attached.jpg'),
			'detachedImage' => asset('img/full-size/signature-paralyzer-detached.jpg'),
			'thumb' => asset('img/thumbs/signature-paralyzer.png'),
			'emailImage' => asset('img/email-assets/thumbs/signature-e.png'),
			'name' => 'Signature Paralyzer',
			'shortName' => 'Signature',
			'slug' => 'signature-paralyzer',
			'price' => 4500,
			'description' => '<p>13.5” Have you had a bad experience with a 
				paralyzer, fish coming off so soon that the only 
				thing paralyzed was your confidence in the 
				product? You were probably dealing with a three 
				prong that had no potential for spring function.</p>

				<p class="faded">Coming Soon - Watch FAQ Video about this Paralyzer</p>

				<p>The "spring" action is the mechanism behind a 
				paralyzer that successfully lands fish and we’ve 
				done it right. Paralyzer heads are not just for small 
				fish. Ours will prove that to you.</p>

				<p class="detail">Our paralyzers are designed with tines that are mounted in a parallel position, 
				maximizing spring force when they puncture a fish - Unlike other paralyzers on 
				the market designed with tines already \'angled out\'. Upon arrival at your 
				doorstep, ours will be totally "parallel". Most Spearos spread tines out by hand 
				to a nickel or quarter diameter to help the \'spring\' start upon penetration of a 
				fish. Hardened 17-4 Stainless Steel Prongs. Thread type 3/8" - 24.</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => 'GATKU\'s Signature Paralyzer Head is ideal for spearing any size fish',
			'length' => 'PARALYZER'
		]);


		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 2, 
			'attachedImage' => asset('img/full-size/barbed-paralyzer-attached.jpg'),
			'detachedImage' => asset('img/full-size/barbed-paralyzer-detached.jpg'),
			'thumb' => asset('img/thumbs/barbed-paralyzer.png'),
			'emailImage' => asset('img/email-assets/thumbs/barbed-e.png'),
			'name' => 'Barbed Paralyzer',
			'shortName' => 'Barbed',
			'slug' => 'barbed-paralyzer',
			'price' => 4500,
			'description' => '<p>13.5” The barbed feature on this paralyzer gives 
				extra assurance for landing smaller critters whose 
				flesh may
				not be dense enough to activate the 
				"spring" action. Lionfish, He\'e and Sculpin for 
				instance, which can be relatively small, sometimes 
				only enough to fit two tines into.</p>

				<p class="faded">Coming Soon - Watch FAQ Video about this Paralyzer</p>

				<p>We know our product well, we make it all with our 
				own hands on our own machines. Trustworthy 
				quality, unparalleled service.</p> 

				<p class="detail">Our paralyzers are designed with tines that are mounted in a parallel 
				position, maximizing spring force when they puncture a fish - Unlike other 
				paralyzers on the market designed with tines already \'angled out\'. Upon 
				arrival at your doorstep, ours will be totally "parallel". Most Spearos spread 
				tines out by hand to a nickel or quarter diameter to help the \'spring\' start 
				upon penetration of a fish. 304 stainless steel tines 3/8" - 24</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => 'PARALYZER'
		]);


		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 2, 
			'attachedImage' => asset('img/full-size/sliptip-attached.jpg'),
			'detachedImage' => asset('img/full-size/sliptip-detached.jpg'),
			'thumb' => asset('img/thumbs/slip-tip.png'),
			'emailImage' => asset('img/email-assets/thumbs/sliptip-e.png'),
			'name' => 'SlipTip',
			'shortName' => 'SlipTip',
			'slug' => 'slip-tip',
			'price' => 6500,
			'description' => '<p>A durable shaft teamed with a sleek and simplistic 
				design. Triple our G1’s tensile strength, we have 
				dedicated more research and development to this 
				area of our quiver than to anywhere else - we are 
				proud of the results and are confident it will serve 
				you well. 8 years in the making, our G2 SlipTip is 
				the weapon of choice for big fish, no fish is too big.</p>

				<p class="faded">Coming Soon - <span class="bold">Watch FAQ Video</span> about this Head</p>

				<p>Use this head for Grouper, Hogs, Snapper, Halibut,
				White Seabass, Yellowtail, and other pelagic fish. 
				Commonly paired with our <hover-card slug="niner">NINE’ER</hover-card> and <hover-card slug="tener">TEN’ER</hover-card></p>

				<p class="detail">Changing the angle of the hole in the tip allows the toggle line to bend back 
				without the high-profile extrusion. We also counter-sink the hole so the knot 
				fits snuggly inside the tip with little exposure. Made from 5/16" hardened 
				stainless steel that rides on a 3/16" shaft. The Dynema® slip line is 
				embedded into the stainless tip. The result is a sleek design that leaves the 
				smallest hole possible in your fish. Thread Thread type is 3/8—24.</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => '14"'
		]);

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 2, 
			'attachedImage' => asset('img/full-size/flopper-attached.jpg'),
			'detachedImage' => asset('img/full-size/flopper-detached.jpg'),
			'thumb' => asset('img/thumbs/flopper.png'),
			'emailImage' => asset('img/email-assets/thumbs/flopper-e.png'),
			'name' => 'Flopper',
			'shortName' => 'Flopper',
			'slug' => 'flopper',
			'price' => 5500,
			'description' => '<p>Designed to be nothing less than bulletproof. This 
				stout shaft is made from hardened stainless steel, 
				the most ideal material on the market (that’s 
				coming from a machinist)–go ahead, try to bend 
				it–it won’t give.</p> 

				<p class="faded">Coming Soon - Watch FAQ Video about this Head</p>

				<p>With a little locational sharpening, this head will 
				prove to be a "killer" for a lifetime. Go for such fish
				as Hog Fish, Snapper, and Striped Bass, etc.</p>

				<p class="detail">Mounted with a stainless rivet, each one is carefully assembled and tuned by 
				hand. 5/16” shaft made from 17-4 hardened stainless steel. Thread type 3/8 - 
				24</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => '15.5"'
		]);
			
		
		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 1, 
			'attachedImage' => asset('img/full-size/sixer-attached.jpg'),
			'detachedImage' => asset('img/full-size/sixer-detached.jpg'),
			'thumb' => asset('img/thumbs/polespear-end.png'),
			'emailImage' => asset('img/email-assets/thumbs/polespear-e.png'),
			'name' => 'Six\'er',
			'shortName' => 'Six',
			'slug' => 'sixer',
			'price' => 12000,
			'description' => '<p>Our 6 foot pole <span class="bold">breaks down into two sections</span>. 
				The all aluminum rear section which is 32 inches, 
				and the carbon graphite front end section which is 
				29 inches. Heads are sold separately. Usually the 
				SIX\'ER is paired with our <hover-card slug="signature-paralyzer">Signature Paralyzer</hover-card> or 
				our <hover-card slug="barbed-paralyzer">Barbed Paralyzer.</hover-card></p>

				<p class="faded"><span class="bold">Coming Soon</span> - Watch FAQ Video about this Polespear</p>

				<p>Great for beginners.</p>

				<p>Use in conditions such as inshore diving, reefs, low 
				visibility, sitting duck fish, rivers, streams, cracks 
				and crevices. Typically used when going for smaller 
				fish under 10lbs.</p>',
			'maneuverability' => 'Sleek, 3/8” diameter, carbon graphite front end allows diver to  effortlessly swing polespear with minimized drag in the water;  This is especially a benefit when tracking fish.',
			'trajectory' => 'Extended section in front of loaded hand allows you to see  where the polespear is headed. Eliminating the \'shooting from  the hip\' factor. Instead, you are capable of pinpointing target  with limited guesswork.',
			'balance' => 'Polespear won\'t feel so \'weighted down\' in the rear with the  tip 3’ away from loaded hand; Resulting in natural tracking  movements plus a more comfortable hold.',
			'stealth' => 'With 3’ of polespear in front of your extended, loaded hand,  fish are much more approachable. The proximity of a diver\'s  body and the fish is a greater distance, making it less likely  spooked.',
			'metaDescription' => 'GATKU\'s Signature Paralyzer Head is ideal for spearing any size fish',
			'length' => '152cm'
		]);

		
		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 1, 
			'attachedImage' => asset('img/full-size/sevener-attached.jpg'),
			'detachedImage' => asset('img/full-size/sevener-detached.jpg'),
			'thumb' => asset('img/thumbs/polespear-end.png'),
			'emailImage' => asset('img/email-assets/thumbs/polespear-e.png'),
			'name' => 'Seven\'er',
			'shortName' => 'Seven',
			'slug' => 'sevener',
			'price' => 14000,
			'description' => '<p>Our 7 foot pole breaks down into two sections. 
				The all aluminum rear section which is 44 inches, 
				and the carbon graphite front end section which is 
				29 inches. Heads are sold separately. Usually the 
				SEVEN\'ER is paired with our <hover-card slug="signature-paralyzer">Signature Paralyzer</hover-card>
				or our <hover-card slug="barbed-paralyzer">Barbed Paralyzer</hover-card>.</p>

				<p class="faded"><span class="bold">Coming Soon</span> - Watch FAQ Video about this Polespear</p>

				<p>Great for beginners. Very similiar to the SIX’ER 
				just packs more distance and punch. </p>

				<p>Use in conditions such as inshore diving, reefs, low 
				visibility, sitting duck fish, rivers, streams, cracks 
				and crevices. Typically used when going for smaller 
				fish under 10lbs.</p>',
			'maneuverability' => 'Sleek, 3/8” diameter, carbon graphite front end allows diver to  effortlessly swing polespear with minimized drag in the water;  This is especially a benefit when tracking fish.',
			'trajectory' => 'Extended section in front of loaded hand allows you to see  where the polespear is headed. Eliminating the \'shooting from  the hip\' factor. Instead, you are capable of pinpointing target  with limited guesswork.',
			'balance' => 'Polespear won\'t feel so \'weighted down\' in the rear with the  tip 3’ away from loaded hand; Resulting in natural tracking  movements plus a more comfortable hold.',
			'stealth' => 'With 3’ of polespear in front of your extended, loaded hand,  fish are much more approachable. The proximity of a diver\'s  body and the fish is a greater distance, making it less likely  spooked.',
			'metaDescription' => '',
			'length' => '182cm'
		]);
			
		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 1, 
			'attachedImage' => asset('img/full-size/eighter-attached.jpg'),
			'detachedImage' => asset('img/full-size/eighter-detached.jpg'),
			'thumb' => asset('img/thumbs/polespear-end.png'),
			'emailImage' => asset('img/email-assets/thumbs/polespear-e.png'),
			'name' => 'Eight\'er',
			'shortName' => 'Eight',
			'slug' => 'eighter',
			'price' => 16000,
			'description' => '<p>Our 8 foot pole breaks down into two sections. 
				The all aluminum rear section which is 47 inches, 
				and the carbon graphite front end section which is 
				36 inches. Heads are sold separately. Usually the 
				EIGHTER\'ER is paired with our <hover-card slug="flopper">Flopper Head</hover-card>.</p> 

				<p class="faded"><span class="bold">Coming Soon</span> - Watch FAQ Video about this Polespear</p>

				<p>Good for intermediate divers.</p>

				<p>The most versatile spear we offer, a weapon for just 
				about every occasion. Use our <hover-card slug="signature-paralyzer">Signature Paralyzer</hover-card> 
				or <hover-card slug="barbed-paralyzer">Barbed Paralyzer</hover-card> with <hover-card slug="inshore-shrinker">InshoreShrinker</hover-card> for 
				inshore diving. If going for bigger pelagic fish be 
				sure to get our <hover-card slug="slip-tip">SlipTip</hover-card>.</p>',
			'maneuverability' => 'Sleek, 3/8” diameter, carbon graphite front end allows diver to  effortlessly swing polespear with minimized drag in the water;  This is especially a benefit when tracking fish.',
			'trajectory' => 'Extended section in front of loaded hand allows you to see  where the polespear is headed. Eliminating the \'shooting from  the hip\' factor. Instead, you are capable of pinpointing target  with limited guesswork.',
			'balance' => 'Polespear won\'t feel so \'weighted down\' in the rear with the  tip 3’ away from loaded hand; Resulting in natural tracking  movements plus a more comfortable hold.',
			'stealth' => 'With 3’ of polespear in front of your extended, loaded hand,  fish are much more approachable. The proximity of a diver\'s  body and the fish is a greater distance, making it less likely  spooked.',
			'metaDescription' => '',
			'length' => '208cm'
		]);


		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 1, 
			'attachedImage' => asset('img/full-size/niner-attached.jpg'),
			'detachedImage' => asset('img/full-size/niner-detached.jpg'),
			'thumb' => asset('img/thumbs/polespear-end.png'),
			'emailImage' => asset('img/email-assets/thumbs/polespear-e.png'),
			'name' => 'Nine\'er',
			'shortName' => 'Nine',
			'slug' => 'niner',
			'price' => 18000,
			'description' => '<p>Our 9 foot pole breaks down into two sections. 
				The all aluminum rear section which is 55 inches, 
				and the carbon graphite front end section which is 
				42 inches. Heads are sold separately. Usually the 
				NINE\'ER is paired with our <hover-card slug="slip-tip">SlipTip</hover-card>.</p> 

				<p class="faded"><span class="bold">Coming Soon</span> - Watch FAQ Video about this Polespear</p>

				<p>More for experienced divers.</p>

				<p>Perfect weapon for the Bahamas. Go after Hog 
				Fish, Snapper, Grouper and all the small stuff too 
				when coupled with our <hover-card slug="inshore-shrinker">InshoreShrinker</hover-card>. Also 
				acceptable for pelagic fish, use our SlipTip.</p>',
			'maneuverability' => 'Sleek, 3/8” diameter, carbon graphite front end allows diver to  effortlessly swing polespear with minimized drag in the water;  This is especially a benefit when tracking fish.',
			'trajectory' => 'Extended section in front of loaded hand allows you to see  where the polespear is headed. Eliminating the \'shooting from  the hip\' factor. Instead, you are capable of pinpointing target  with limited guesswork.',
			'balance' => 'Polespear won\'t feel so \'weighted down\' in the rear with the  tip 3’ away from loaded hand; Resulting in natural tracking  movements plus a more comfortable hold.',
			'stealth' => 'With 3’ of polespear in front of your extended, loaded hand,  fish are much more approachable. The proximity of a diver\'s  body and the fish is a greater distance, making it less likely  spooked.',
			'metaDescription' => '',
			'length' => '243cm'
		]);
	
		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 1, 
			'attachedImage' => asset('img/full-size/tener-attached.jpg'),
			'detachedImage' => asset('img/full-size/tener-detached.jpg'),
			'thumb' => asset('img/thumbs/polespear-end.png'),
			'emailImage' => asset('img/email-assets/thumbs/polespear-e.png'),
			'name' => 'Ten\'er',
			'shortName' => 'Ten',
			'slug' => 'tener',
			'price' => 19000,
			'description' => '<p>Our 10 foot pole breaks down into two sections. 
				The all aluminum rear section which is 60 inches, 
				and the carbon graphite front end section which is 
				42 inches. Heads are sold separately. Usually the 
				TEN\'ER is paired with our <hover-card slug="slip-tip">SlipTip</hover-card>.</p> 

				<p class="faded"><span class="bold">Coming Soon</span> - Watch FAQ Video about this Polespear</p>

				<p>More for experienced divers.</p>

				<p>Traditionally an open-water only spear, now our
				<hover-card slug="inshore-shrinker">InshoreShrinker</hover-card> can be attached to make it more 
				of a "reef hunter". Go for such fishas Yellowtail, 
				Wahoo, Amberjack, White Seabass, and Dorado,
				etc.</p>',
			'maneuverability' => 'Sleek, 3/8” diameter, carbon graphite front end allows diver to  effortlessly swing polespear with minimized drag in the water;  This is especially a benefit when tracking fish.',
			'trajectory' => 'Extended section in front of loaded hand allows you to see  where the polespear is headed. Eliminating the \'shooting from  the hip\' factor. Instead, you are capable of pinpointing target  with limited guesswork.',
			'balance' => 'Polespear won\'t feel so \'weighted down\' in the rear with the  tip 3’ away from loaded hand; Resulting in natural tracking  movements plus a more comfortable hold.',
			'stealth' => 'With 3’ of polespear in front of your extended, loaded hand,  fish are much more approachable. The proximity of a diver\'s  body and the fish is a greater distance, making it less likely  spooked.',
			'metaDescription' => '',
			'length' => '256cm'
		]);


		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 3, 
			'attachedImage' => '',
			'detachedImage' => asset('img/full-size/inshore-shrinker-detached-2.jpg'),
			'thumb' => asset('img/thumbs/inshore-shrinker.png'),
			'emailImage' => asset('img/email-assets/thumbs/shrinker-e.png'),
			'name' => 'InshoreShrinker',
			'shortName' => 'InshoreShrinker',
			'slug' => 'inshore-shrinker',
			'price' => 4900,
			'description' => '<p>14” Aluminum segment designed to ‘shrink’ your 
				hybrid polespear by as much as 29”. It comes 
				covered in our signature shrink wrap grip and is 
				compatible with all G2 hybrid lengths.</p>  

				<p class="faded"><span class="bold">Watch FAQ Video</span> about the Shrinker</p>

				<p>This newly developed front end replacement 
				removes the extra length of pole when you don’t 
				need it. Within seconds, change out your front end 
				to adapt from open water hunting to close 
				encounters on the reef.</p>

				<p class="detail">Lets face it, some of us dive in conditions or target certain fish that do not 
				require the length of a hybrid-style spear. ‘Sitting duck’ fish that spend most 
				of their time perched on rocks are more approachable with less extension in 
				front of the loaded hand. Other times, divers are faced with less than a few 
				feet of visibility, rendering a lengthy extension useless - here is the solution 
				to all of that. If we haven’t made it clear, every pole purchase should include 
				one of these - It’s like getting 2 different poles for only an added $49.</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => 'Our Newly Developed Front-End Replacement Removes the Extra Length of Pole when you Don’t Need it. Within Seconds, Change Out your Front-End to Adapt from Open-Water Hunting to Close Encounters on the Reef.',
			'length' => ''
		]);
		
		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 4, 
			'attachedImage' => asset('img/full-size/knife-attached.jpg'),
			'detachedImage' => '',
			'thumb' => asset('img/thumbs/knife.png'),
			'emailImage' => asset('img/email-assets/thumbs/knife-e.png'),
			'name' => 'Budk',
			'shortName' => 'Budk',
			'slug' => 'budk',
			'price' => 1700,
			'description' => '<p>It’s common to drop and lose your knife at some 
				point throughout your spearfishing endeavors - why 
				make it a high dollar one you’ll cry about? Instead, 
				choose this low-profile knife. It comes with it’s own 
				super-sleek plastic sheath & straps.<p/>

				<p>This 400 series stainless-steel dagger is the most 
				low-profile knife on the market. Ideal for any spearo 
				- hell we even use it!</p> 


				<p>Hard plastic case and optional rubber straps included with order. We Know 
				the Spearo’s Needs, Because We are Spearos.&trade;</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => 'This 400 series stainless-steel dagger is the most  low-profile knife on the market. Ideal for any spearo  - hell we even use it!',
			'length' => '8.5"'
		]);

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 4, 
			'attachedImage' => asset('img/full-size/hardcore-band-attached.jpg'),
			'detachedImage' => '',
			'thumb' => asset('img/thumbs/band.png'),
			'emailImage' => asset('img/email-assets/thumbs/band-e.png'),
			'name' => 'Extra Band',
			'shortName' => 'Extra Band',
			'slug' => 'bands',
			'price' => 1400,
			'description' => '<p>Rubber does not last forever. An extra band is nice 
				to have on hand. Quick change bands allow you to 
				go from band to band in a matter of seconds. Each 
				band length is custom fit to your polespear length.</p> 

				<p>Our SIX’ER, SEVEN’ER and EIGHT’ER use 3/8” 
				band while our NINE’ER and TEN’ER use 7/16” 
				band. Our wishbones are now made from 400# test 
				Dyneema&reg;</p> 


				<p class="detail">Wishbone is the connector attached to the rubber and looped into the pole 
				end. It’s good to have a few of these on hand if your diving regularly. They 
				ship for free with the order of any other product, always looking out for our 
				customers!</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => 'Rubber does not last forever. An extra band is nice  to have on hand.',
			'length' => '',
			'sizeable' => true
		]);

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 5, 
			'attachedImage' => asset('img/apparel/niner/niner-1.jpg'),
			'detachedImage' => '',
			'thumb' => asset('img/thumbs/niner-tshirt-thumb.jpg'),
			'emailImage' => asset('img/email-assets/thumbs/niner-e.jpg'),
			'name' => '9\'ER',
			'shortName' => '9\'ER T-Shirt',
			'slug' => 'niner-tshirt',
			'price' => 2500,
			'description' => '<p>Hybrid Stripes! Slip Tip head w/NINE’ER pole componenents making horizontal stripes across chest. Tagless screenprinted neck label on Black 100% Cotton Fitted Shirt. Print done with specialty discharge ink - virtually unfeelable after first wash</p><p>High fashion feel, we know sexy!</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => 'SHIRT',
			'sizeable' => true
		]);

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 5, 
			'attachedImage' => asset('img/apparel/superhero/superhero-1.jpg'),
			'detachedImage' => '',
			'thumb' => asset('img/thumbs/superhero-tshirt-thumb.jpg'),
			'emailImage' => asset('img/email-assets/thumbs/superhero-e.jpg'),
			'name' => 'SuperHero',
			'shortName' => 'SuperHero T-Shirt',
			'slug' => 'superhero-tshirt',
			'price' => 2500,
			'description' => '<p>GATKU Chest Emblem front print on Heather Navy Cotton/Poly Blend Fitted Shirt. Tagless screenprinted neck label.</p> <p>Classy on All Fronts!</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => 'SHIRT',
			'sizeable' => true
		]);

		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 5, 
			'attachedImage' => asset('img/apparel/comfort/comfort-1.jpg'),
			'detachedImage' => '',
			'thumb' => asset('img/thumbs/comfort-jacket-thumb.jpg'),
			'emailImage' => asset('img/email-assets/thumbs/comfort-e.jpg'),
			'name' => 'Comfort',
			'shortName' => 'Comfort Hoody',
			'slug' => 'comfort-hoody',
			'price' => 4900,
			'description' => '<p>Pull Over Hoody, Great for after dive chill and all around town. Abstract GATKU Icon across chest - THE BEST NAME IN SPEARFISHING.</p> <p>80% Poly / 20% Cotton - Black.</p> <p>Conveniently folds up into itself, as seen to the right - (Pouch Ryan Gattoni is holding). Thumb slots in sleeves for added comfort and warmth. GATKU cares!</p>',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => '',
			'length' => 'HOODY',
			'sizeable' => true

		]);



		Product::create([
			'availabilityTypeId' => 1,
			'typeId' => 6, 
			'attachedImage' => '',
			'detachedImage' => '',
			'thumb' => '',
			'emailImage' => null,
			'name' => 'Shrink Wrap Grip',
			'shortName' => 'Shrink Wrap',
			'slug' => 'shrink-wrap',
			'price' => 1000,
			'description' => 'Extra shrink wrap for your polespear grip.',
			'maneuverability' => '',
			'trajectory' => '',
			'balance' => '',
			'stealth' => '',
			'metaDescription' => 'Extra shrink wrap for your polespear grip.',
			'length' => ''
		]);


		// Template
		// Product::create([
		//'availabilityTypeId' => 1,
		// 	'typeId' => 0, 
		// 	'attachedImage' => '',
		// 	'detachedImage' => '',
		// 	'thumb' => '',
		// 	'name' => '',
		// 	'shortName' => '',
		// 	'slug' => '',
		// 	'price' => 0,
		// 	'description' => '',
		// 	'maneuverability' => '',
		// 	'trajectory' => '',
		// 	'balance' => '',
		// 	'stealth' => '',
		// 	'metaDescription' => '',
		// 	'length' => ''
		// ]);

	}
}

