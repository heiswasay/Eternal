import bo1Image from "../images/bo1.webp";
import bo2Image from "../images/bo2.webp";
import bo3Image from "../images/bo3.webp";
import bo4Image from "../images/bo4.webp";
import bo5Image from "../images/bo5.webp";
import bo6Image from "../images/bo6.webp";
import bo7Image from "../images/bo7.webp";
import bo8Image from "../images/bo8.webp";

import m1Image from "../images/m1.webp";
import m2Image from "../images/m2.webp";
import m3Image from "../images/m3.webp";
import m4Image from "../images/m4.webp";
import m5Image from "../images/m5.webp";
import m6Image from "../images/m6.webp";
import m8Image from "../images/m8.webp";
import m10Image from "../images/m10.webp";
import m11Image from "../images/m11.webp";

import boo1Image from "../images/boo1.webp";
import boo3Image from "../images/boo3.webp";
import boo4Image from "../images/boo4.webp";
import boo5Image from "../images/boo5.webp";
import boo6Image from "../images/boo6.webp";
import boo8Image from "../images/boo8.webp";
import boo9Image from "../images/boo9.webp";
import boo10Image from "../images/boo10.webp";
import boo11Image from "../images/boo11.webp";
import layersbooImage from "../images/layersboo.png";

export interface SpecType {
  type: string;
  leather: string;
  leatherDetail: string;
  sole: string;
  soleDetail: string;
  laces: string;
  lacesDetail: string;
  lining: string;
  construction: string;
  leatherImage?: string;
  soleImage?: string;
  lacesImage?: string;
  anatomyImage?: string;
  layersImage?: string;
}

export interface CollectionItemInfo {
  id: number;
  name: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  slug: string;
  description: string;
  specs: SpecType;
}

export const COLLECTIONS: CollectionItemInfo[] = [
  {
    id: 1,
    name: "Brown Oxford Leather",
    price: "PKR 5,950",
    image: bo1Image,
    images: [bo1Image, bo2Image, bo3Image, bo4Image, bo5Image, bo6Image, bo7Image, bo8Image],
    category: "Hand Made",
    slug: "brown-oxford-leather",
    description: "The height of sartorial elegance, featuring hand-burnished leather and artisanal buckle detailing.",
    specs: {
      type: "Semi-Brogue Captoe Oxford",
      leather: "Mahogany Burnished Alpine Calfskin",
      leatherDetail: "Full-grain textured French Box-Calf leather featuring a magnificent, deep mahogany burnish. Selected for its highly resilient, dense grain structure that holds up wonderfully to moist weather.",
      sole: "Double-Leather Oak Bark Outsole with Brass Pin Protection",
      soleDetail: "Ultra-durable double-thickness sole, constructed of genuine oak-bark bend leather. Reinforced with 15 hand-driven solid brass pegs on the shank and a beautiful flush gold-plated steel toe-cap protection.",
      laces: "Round-Braided Corded Egyptian Cotton Waxed Laces",
      lacesDetail: "Meticulously braided round Egyptian cotton laces, deeply impregnated with natural wax. Slides smoothly and cleanly through nickel-plated metal eyelets without binding.",
      lining: "Butter-Soft Full-Grain Tan Calf Lining",
      construction: "270-Degree Goodyear Welt"
    }
  },
  {
    id: 2,
    name: "Monk Strap",
    price: "PKR 5,950",
    image: m8Image,
    images: [m8Image, m1Image, m3Image, m2Image, m4Image, m5Image],
    category: "Hand Made",
    slug: "monk-strap",
    description: "A timeless classic in a rich cognac hue, featuring a hand-welted sole for unparalleled durability.",
    specs: {
      type: "Double Monk Strap Dress Shoe",
      leather: "Aniline-Dyed Museum Calfskin (Cognac Brown Patina)",
      leatherDetail: "Individually hand-burnished aniline-dyed calfskin with a distinctive marbleized museum effect. Prepared using organic tree bark extracts and finished with countless hand-applied layers of mineral cream wax.",
      sole: "Hand-Welted Italian Oak-Bark Outsole with Stacked Specialty Heel",
      soleDetail: "Double-tanned dense oak-bark outsole that offers exceptional shock absorption and orthopedic flexibility. Hand-cut and polished edges with subtle hand-stamped decorative detailing on the waist.",
      laces: "Double Brass Buckle Straps with Hidden Elastic Anchor Guards",
      lacesDetail: "Instead of standard laces, this masterpiece is secured with two adjustable solid brass buckles individually cast in Florence, held securely by soft, heavy-grade hidden elastic segments to optimize standard flex.",
      lining: "Hand-Selected Glove-Grade Milled Sheepskin Lining",
      construction: "Rapid Blake stitch",
      leatherImage: m10Image,
      soleImage: m11Image,
      lacesImage: m6Image
    }
  },
  {
    id: 3,
    name: "Black Oxford Leather",
    price: "PKR 5,950",
    image: boo1Image,
    images: [boo1Image, boo3Image, boo4Image, boo5Image, boo8Image, boo9Image],
    category: "Hand Made",
    slug: "black-oxford-leather",
    description: "Our signature piece, hand-stitched over 48 hours using the finest full-grain Italian calfskin.",
    specs: {
      type: "Wholecut Bespoke Oxford",
      leather: "Ultra-Premium Full-Grain Italian Box-Calf (Tuscan Tannery)",
      leatherDetail: "Sourced from an antique artisan tannery in Tuscany, Italy. We select only the top 3% of unblemished aniline skins. Naturally supple and highly breathable, this pristine box-calf develops a beautiful deep mirror-like glaze with age.",
      sole: "Hand-Stitched Closed-Channel Goodyear Welt Outsole with Fiddleback Waist",
      soleDetail: "A multi-layered oak-bark tanned leather outsole with a traditional 270-degree hand-sewn welt. Features a hand-carved, highly defined fiddleback waist and a stacked solid leather heel for maximum stability.",
      laces: "Flat-Braided Waxed Giza Cotton Laces",
      lacesDetail: "Tightly-braided, extra-long-staple Egyptian Giza cotton fibres treated with an ultra-thin coating of natural organic beeswax for high tensile strength, fray prevention, and an enduring secure knot.",
      lining: "Hand-Dyed Glove-Grade Italian Calf-Lining",
      construction: "Handwelted Goodyear",
      leatherImage: boo6Image,
      soleImage: boo11Image,
      lacesImage: boo10Image,
      anatomyImage: boo9Image,
      layersImage: layersbooImage
    }
  }
];
