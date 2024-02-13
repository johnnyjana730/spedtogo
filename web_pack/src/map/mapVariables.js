import L from 'leaflet';

import { RiRestaurant2Line } from 'react-icons/ri';
import { MdMuseum, MdOutlinePark, MdOutlineAttractions } from 'react-icons/md';
import { GrAttraction } from "react-icons/gr";
import { GiBarracksTent } from "react-icons/gi"
import { HiBuildingStorefront, HiMiniBuildingStorefront } from "react-icons/hi2";
import { PiTreeDuotone } from 'react-icons/pi';
import { LuChurch } from 'react-icons/lu';
import { renderToString } from 'react-dom/server';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export const blackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const greyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



export const violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const yellowrIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



let iconfotsize = '24px';
let iconlogsize = 26;

if (window.innerWidth < 800) {
    iconfotsize = '20px';
    iconlogsize = 22;
}

let star_fontSize = '18px';

if (window.innerWidth < 800) {
    star_fontSize = '15px';
}


const starIconClass = 'star-icon';

const starIcon = (
  <div className={starIconClass}>
    <FaStar style={{color: 'rgba(255, 195, 0, 0.9)', fontSize: star_fontSize }} />)
  </div>
);


const createCustomIcon = (iconComponent) => {
  return L.divIcon({
    className: 'custom-icon',
    html: renderToString(iconComponent),
    iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
  });
};


export const restaurantIcon = createCustomIcon(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsize }} />);
export const museumIcon = createCustomIcon(<MdMuseum style={{ color: 'white', fontSize: iconfotsize }} />);
export const parkIcon = createCustomIcon(<PiTreeDuotone style={{ color: 'white', fontSize: iconfotsize }} />);
export const churchIcon = createCustomIcon(<LuChurch style={{ color: 'white', fontSize: iconfotsize }} />);
export const attractionIcon = createCustomIcon(<HiMiniBuildingStorefront style={{ color: 'white', fontSize: iconfotsize }} />);
export const attraction2Icon = createCustomIcon(<MdOutlineAttractions style={{ color: 'white', fontSize: iconfotsize }} />);


const createCustomIconPoP = (iconComponent) => {
  return L.divIcon({
    className: 'custom-icon-popular',
    html: `
      <div>
        ${renderToString(iconComponent)}
        ${renderToString(starIcon)}
      </div>
    `,
    iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
  });
};

export const restaurantIconPoP = createCustomIconPoP(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsize }} />);
export const museumIconPoP = createCustomIconPoP(<MdMuseum style={{ color: 'white', fontSize: iconfotsize }} />);
export const parkIconPoP = createCustomIconPoP(<PiTreeDuotone style={{ color: 'white', fontSize: iconfotsize }} />);
export const churchIconPoP = createCustomIconPoP(<LuChurch style={{ color: 'white', fontSize: iconfotsize }} />);
export const attractionIconPoP = createCustomIconPoP(<HiMiniBuildingStorefront style={{ color: 'white', fontSize: iconfotsize }} />);
export const attraction2IconPoP = createCustomIconPoP(<MdOutlineAttractions style={{ color: 'white', fontSize: iconfotsize }} />);


let iconfotsizeHL = '24px';
let iconlogsizeHL = 26;


if (window.innerWidth < 800) {
    iconfotsizeHL = '20px';
    iconfotsizeHL = 22;
}


const createCustomIconHL = (iconComponent) => {
  return L.divIcon({
    className: 'custom-icon-highlight',
    html: renderToString(iconComponent),
    iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
  });
};

export const restaurantIconHL = createCustomIconHL(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsizeHL }} />);
export const museumIconHL = createCustomIconHL(<MdMuseum style={{ color: 'white', fontSize: iconfotsizeHL }} />);
export const parkIconHL = createCustomIconHL(<PiTreeDuotone style={{ color: 'white', fontSize: iconfotsizeHL }} />);
export const churchIconHL = createCustomIconHL(<LuChurch style={{ color: 'white', fontSize: iconfotsizeHL }} />);
export const attraction2IconHL = createCustomIconHL(<MdOutlineAttractions style={{ color: 'white', fontSize: iconfotsizeHL }} />);
export const attractionIconHL = createCustomIconHL(<HiMiniBuildingStorefront style={{ color: 'white', fontSize: iconfotsizeHL }} />);

// 
// const createCustomIconHL = (iconComponent) => {
//   return L.divIcon({
//     className: 'custom-icon-popular',
//     html: renderToString(iconComponent),
//     iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
//   });
// };

// 
// export const restaurantIcon = L.divIcon({
//   className: 'custom-icon-popular',
//   html: `
//     <div>
//       ${renderToString(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsize }} />)}
//       ${renderToString(starIcon)}
//     </div>
//   `,
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 
// 

// 
// 
// const createCustomIconHL = (iconComponent) => {
//   return L.divIcon({
//     className: 'custom-icon-highlight',
//     html: renderToString(iconComponent),
//     iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
//   });
// };
// 
// export const restaurantIconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 
// 
// export const museumIconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<MdMuseum style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 
// export const parkIconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<PiTreeDuotone style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 
// export const churchIconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<LuChurch style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 
// 
// export const attraction2IconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<MdOutlineAttractions style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 
// 
// export const attractionIconHL = L.divIcon({
//   className: 'custom-icon-highlight',
//   html: renderToString(<HiMiniBuildingStorefront style={{ color: 'white', fontSize: iconfotsizeHL }} />),
//   iconSize: [iconlogsizeHL, iconlogsizeHL], // Set the desired icon size
// });
// 

// 
// export const restaurantIcon = L.divIcon({
//   className: 'custom-icon-popular',
//   html: `
//     <div>
//       ${renderToString(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsize }} />)}
//       ${renderToString(starIcon)}
//     </div>
//   `,
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });



// export const restaurantIcon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<RiRestaurant2Line style={{ color: 'white', fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });

// 
// export const museumIcon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<MdMuseum style={{ color: 'white', fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 
// export const parkIcon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<PiTreeDuotone style={{ color: 'white', fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 
// export const churchIcon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<LuChurch style={{ color: 'white', fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 
// 
// 
// export const attractionIcon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<HiMiniBuildingStorefront style={{ color: "white", fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 
// 
// export const attraction2Icon = L.divIcon({
//   className: 'custom-icon',
//   html: renderToString(<MdOutlineAttractions style={{ color: 'white', fontSize: iconfotsize }} />),
//   iconSize: [iconlogsize, iconlogsize], // Set the desired icon size
// });
// 