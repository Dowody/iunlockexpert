import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Smartphone, Tablet, Laptop, 
  Lock, Shield, Globe, 
  CheckCircle,
  HelpCircle,
  X,
  Info
} from 'lucide-react';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Footer from './Footer';



export const appleDevices = {
  iphone: [
    { model: "iPhone 16 Pro Max", price: "$74.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_pro_max_desert_1_539c7c47.jpg" },
    { model: "iPhone 16 Pro", price: "$69.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_pro_natural_1_ced4b12b.jpg" },
    { model: "iPhone 16 Plus", price: "$64.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_plus_teal_1_0d8097fd.jpg" },
    { model: "iPhone 16", price: "$59.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_ultramarine_1_2598b2a3.jpg" },
    { model: "iPhone 15 Pro Max", price: "$69.99", image: "https://cdn0.it4profit.com/s3size/rt:fill/w:900/h:900/g:no/el:1/f:webp/plain/s3://cms/product/86/e8/86e83cf2fedc8ed7ad4ddb3452d06b66/250331120227455325.webp" },
    { model: "iPhone 15 Pro", price: "$64.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_15_pro_natural_titanium_pdp_image_position_1_wwen_fc0946e7.jpg" },
    { model: "iPhone 15 Plus", price: "$59.99", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15plus-digitalmat-gallery-4-202309?wid=728&hei=666&fmt=png-alpha&.v=1693011173707" },
    { model: "iPhone 15", price: "$54.99", image: "https://lcdn.altex.ro/media/catalog/product/a/p/apple_iphone_15_black_1_7416a980.jpg" },
    { model: "iPhone 14 Pro Max", price: "$64.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_14_pro_silver-1_56a46342.jpg" },
    { model: "iPhone 14 Pro", price: "$59.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_14_pro_space_black-1_e51401e6.jpg" },
    { model: "iPhone 14 Plus", price: "$54.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/t/e/16fa6a9aef7ffd6209d5fd9338ffa0b1/telefon_apple_iphone_14_plus_5g_yellow_01_29b78407.jpg" },
    { model: "iPhone 14", price: "$49.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_14_purple-1_3df48088.jpg" },
    { model: "iPhone SE (3rd gen)", price: "$34.99", image: "https://www.goblue.dk/images/Apple%20iPhone%20SE%202022%205G%2064GB%20-%20Red%2001-p.jpg" },
    { model: "iPhone 13 Pro Max", price: "$54.99", image: "https://i5.walmartimages.com/seo/Restored-Apple-iPhone-13-Pro-Max-128GB-Sierra-Blue-LTE-Cellular-Straight-Talk-TracFone-MLKP3LL-A-TF-Refurbished_727d1c27-c0da-45fb-b717-e2c7d872c79e.09147146739dde0568cc40c42d283d8c.jpeg" },
    { model: "iPhone 13 Pro", price: "$49.99", image: "https://alo.md/media/media/apple-iphone-13-pro-128gb-graphite-4-trlb7su.webp" },
    { model: "iPhone 13 Mini", price: "$39.99", image: "https://release.no/wp-content/uploads/2024/05/iphone-13-mini-svart-530x530.jpg" },
    { model: "iPhone 13", price: "$44.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/T/e/16fa6a9aef7ffd6209d5fd9338ffa0b1/Telefon_APPLE_iPhone_13_5G_128GB_PRODUCT_RED_4_.jpg" },
    { model: "iPhone 12 Pro Max", price: "$54.99", image: "https://2b.com.eg/media/catalog/product/cache/679f8858b9902c7de68dd2a438fe5f08/p/h/photoeditiion_36__1.jpg" },
    { model: "iPhone 12 Pro", price: "$49.99", image: "https://alo.md/media/media/enter-apple-iphone-12-pro-158-mkstzqh.webp" },
    { model: "iPhone 12 Mini", price: "$39.99", image: "https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/1801c418208f9607a371e61f8d9184d9/1/7/175318_2020.jpg" },
    { model: "iPhone 12", price: "$44.99", image: "https://www.mac4sale.co.uk/media/catalog/product/cache/f27f79ef30603c2c51e5ba294d8fd900/i/p/iphone-12-blue-min_2_1_2.jpg" },
    { model: "iPhone SE (2nd gen)", price: "$29.99", image: "https://i5.walmartimages.com/seo/Restored-Apple-iPhone-SE-2020-Unlocked-Refurbished_a22f98c8-9c70-4ad5-b6c8-3533cbb3af1b.e4399ae4cffbbab02215c4410a4018fd.jpeg" },
    { model: "iPhone 11 Pro Max", price: "$49.99", image: "https://www.dxomark.com/wp-content/uploads/medias/post-52400/Apple-iPhone-11-Pro-Max-Midnight-Green-frontimage-1024x768.jpg" },
    { model: "iPhone 11 Pro", price: "$44.99", image: "https://iphone15.md/media/media/apple-iphone-11-pro1d-idrt44i.webp" },
    { model: "iPhone 11", price: "$39.99", image: "https://alo.md/media/media/seoimagesiphone-11-4-gb-128-gb-black-026-luwndcv-1.webp" },
    { model: "iPhone XS Max", price: "$44.99", image: "https://alo.md/media/products/enter.online/166664/1.webp" },
    { model: "iPhone XS", price: "$39.99", image: "https://highspectech.ie/wp-content/uploads/2020/07/iphone-x-black.png" },
    { model: "iPhone XR", price: "$34.99", image: "https://i2.storeland.net/3/634/206336045/afacdb/smartfon-apple-iphone-xr.jpg" },
    { model: "iPhone X", price: "$39.99", image: "https://files.refurbed.com/ii/iphone-x-1639476663.jpg?t=fitdesign&h=600&w=800" },
    { model: "iPhone 8 Plus", price: "$34.99", image: "https://i5.walmartimages.com/asr/61cbeba7-8bca-4062-b278-673019d304f8_1.44b845bf2c88872f7c7310a0d40bc0e7.jpeg" },
    { model: "iPhone 8", price: "$29.99", image: "https://www.antosmobil.cz/306251-medium_default/apple-iphone-8-256gb-zanovni.jpg" }
  ],
  macbook: [
    // Apple Silicon MacBooks
{ model: "MacBook Pro M4 (2025)", price: "$74.99", image: "https://inventstore.in/wp-content/uploads/2024/11/2-scaled.webp" },
{ model: "MacBook Air M4 (2025)", price: "$74.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/m/a/16fa6a9aef7ffd6209d5fd9338ffa0b1/macbook_air_13_inch_m4_midnight_1_b1bf9b26.jpg" },
{ model: "MacBook Pro M3 (2024)", price: "$69.99", image: "https://idestiny.in/wp-content/uploads/2024/10/Macbook-Pro-16_-600x600.png" },
{ model: "MacBook Air M3 (2024)", price: "$59.99", image: "https://techzone.by/wp-content/uploads/2024/03/Apple-MacBook-Air-13-M3-2024-Midnight-1-min.png" },
{ model: "MacBook Pro M2 (2023)", price: "$64.99", image: "https://s3.ap-southeast-1.amazonaws.com/uploads-store/uploads/all/Bu04z64BCYaaDCVhrsBcmlgiPbxkKEdegvNg1B1o.png" },
{ model: "MacBook Air M2 (2023)", price: "$54.99", image: "https://images.shopkees.com/uploads/cdn/images/1000/9472077453_1655454923.jpg" },
{ model: "MacBook Pro M1 (2020)", price: "$59.99", image: "https://i.simpalsmedia.com/thumbor/500x0/i.simpalsmedia.com/marketplace/products/original/5922242252ed0e05fcf45269c1e60f74.jpg" },
{ model: "MacBook Air M1 (2020)", price: "$49.99", image: "https://5.imimg.com/data5/SELLER/Default/2024/4/414074292/OQ/RG/UD/35721490/apple-macbook-air-500x500.png" },

// Intel MacBooks (by Intel Processor)
{ model: "MacBook Pro 16-inch (2019) - Intel Core i9", price: "$64.99", image: "https://www.devicerefresh.com/cdn/shop/files/c649443e62db96fcc5291f7882758b46_800x.jpg?v=1711389567" },
{ model: "MacBook Pro 15-inch (2019) - Intel Core i7", price: "$59.99", image: "https://mac-store24.com/cdn/shop/files/Apple_MacBook_Pro_15_Zoll_Retina_2019_refurbished_gebraucht-5782931.jpg?v=1732189164" },
{ model: "MacBook Air Retina 13-inch (2018) - Intel Core i5", price: "$44.99", image: "https://mac4school.co.uk/wp-content/uploads/2022/01/macbook_pro_2019_grey_.jpg" },
{ model: "MacBook Pro 13-inch (2016) - Intel Core i5", price: "$49.99", image: "https://www.montedigital.co.ke/wp-content/uploads/2024/07/Untitled-design-2024-07-15T144544.222.png" },
{ model: "MacBook Air 13-inch (2015) - Intel Core i5", price: "$39.99", image: "https://macsolveonline.com/wp-content/uploads/2022/10/3.jpg" }
  ],
  ipad: [
    // iPad
    // iPad Pro
{ model: "iPad Pro 13-inch (1st gen, 2024)", price: "$59.99", image: "https://www.imagineonline.store/cdn/shop/files/iPad_Pro_13_M4_Cellular_Silver_PDP_Image_Position_1b__en-IN_dd2e2a82-05c9-4fc0-9714-0611d65872d3.jpg?v=1716466657&width=823" },
{ model: "iPad Pro 11-inch (5th gen, 2024)", price: "$54.99", image: "https://www.machines.com.my/cdn/shop/products/iPad_Pro_Wi-Fi_11_in_4th_Gen_Silver_PDP_Image_Position-1b__SG.jpg?v=1705419289" },
{ model: "iPad Pro 12.9-inch (6th gen, 2022)", price: "$54.99", image: "https://alephksa.com/cdn/shop/files/iPad_Pro_12_9_inch_Wi-Fi_Space_Gray_PDP_Image_Position-1b_EN_2a446aae-b0f2-477f-95a2-6e2c27c1bbe9.jpg?v=1695930274&width=1445" },
{ model: "iPad Pro 11-inch (4th gen, 2022)", price: "$49.99", image: "https://www.machines.com.my/cdn/shop/products/iPad_Pro_Wi-Fi_11_in_4th_Gen_Silver_PDP_Image_Position-1b__SG_b73779cf-0c6e-4008-8023-92d7d0f26ce4_450x.jpg?v=1705418542" },
{ model: "iPad Pro 9.7-inch (2016)", price: "$34.99", image: "https://d2e6ccujb3mkqf.cloudfront.net/50f4fbbd-a9ca-4de1-8b87-6f4f861745c5-1_add7ec61-fc96-488f-bd61-c55287aab95e.jpg" },
{ model: "iPad Pro 12.9-inch (1st gen, 2015)", price: "$39.99", image: "https://istorepreowned.co.za/cdn/shop/products/iPad_Pro_12.9-inch_2015_1stGen-Space_Grey_c665a954-f7e7-424f-b616-1a037a401813.png?v=1710873602" },

// iPad Air
{ model: "iPad Air (6th gen, 2024)", price: "$44.99", image: "https://www.costco.co.uk/medias/sys_master/images/hf0/hd5/238984826191902.jpg" },
{ model: "iPad Air (5th gen, 2022)", price: "$39.99", image: "https://images.shopkees.com/uploads/cdn/images/1000/6784996745_1646891783.jpg" },
{ model: "iPad Air 2 (2014)", price: "$29.99", image: "https://www.protechintl.com.au/cdn/shop/files/Apple-iPad-Air-2-32gb-wifi-ProTech-IT-Solutions-6599.png?v=1733297019" },

// iPad
{ model: "iPad (11th gen, 2024)", price: "$39.99", image: "https://nama.vn/img/upload/images/products/Apple/iPad/Gen%2011/ipad-gen-11-blue.webp" },
{ model: "iPad (10th gen, 2022)", price: "$34.99", image: "https://i5.walmartimages.com/seo/2022-Apple-10-9-inch-iPad-Wi-Fi-64GB-Silver-10th-Generation_3c544028-8779-4d02-a43a-07c10390daaf.d0be7279a384075f8f6ae23eb4f9d711.jpeg" },
{ model: "iPad (5th gen, 2017)", price: "$29.99", image: "https://store.secondlifemac.com/cdn/shop/products/iPad5thGen-SpaceGray2-Square.jpg?v=1636571433" }
  ]
};


const tutorialSteps = {
  mdm: [
    { 
      title: "Check Device Compatibility", 
      description: "Ensure your device is eligible for MDM bypass",
      icon: Info
    },
    { 
      title: "Select Your Device", 
      description: "Choose the specific model you want to unlock",
      icon: Smartphone
    },
    { 
      title: "Choose Unlock Service", 
      description: "Select the MDM bypass service that fits your needs",
      icon: Lock
    },
    { 
      title: "Complete Payment", 
      description: "Securely pay using cryptocurrency or other methods",
      icon: Shield
    },
    { 
      title: "Receive Instructions", 
      description: "Get detailed unlock instructions via email",
      icon: CheckCircle
    }
  ],
  icloud: [
    { 
      title: "Verify Device Status", 
      description: "Confirm your device is iCloud locked",
      icon: Info
    },
    { 
      title: "Select Device Model", 
      description: "Pick the exact iPhone or iPad model",
      icon: Tablet
    },
    { 
      title: "Select Unlock Package", 
      description: "Choose the iCloud unlock service level",
      icon: Lock
    },
    { 
      title: "Make Secure Payment", 
      description: "Pay using cryptocurrency or preferred method",
      icon: Shield
    },
    { 
      title: "Get Unlock Code", 
      description: "Receive unlock instructions and code via email",
      icon: CheckCircle
    }
  ],
  sim: [
    { 
      title: "Check Carrier Lock", 
      description: "Verify your device is carrier-locked",
      icon: Info
    },
    { 
      title: "Choose Device", 
      description: "Select your specific device model",
      icon: Smartphone
    },
    { 
      title: "Select Unlock Service", 
      description: "Pick the right SIM unlock package",
      icon: Lock
    },
    { 
      title: "Complete Transaction", 
      description: "Pay securely using cryptocurrency",
      icon: Shield
    },
    { 
      title: "Receive Unlock Details", 
      description: "Get unlock instructions sent to your email",
      icon: CheckCircle
    }
  ]
};

const DeviceCatalog: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof appleDevices>("iphone");
  const [showTutorial, setShowTutorial] = useState(true);

  const filteredDevices = appleDevices[selectedCategory]
    .filter(device => device.model.toLowerCase().includes(searchTerm.toLowerCase()));

  const getDeviceIcon = (serviceType: string | undefined) => {
    switch(serviceType) {
      case 'mdm': return Smartphone;
      case 'icloud': return Tablet;
      case 'sim': return Laptop;
      default: return Smartphone;
    }
  };

  const DeviceIcon = getDeviceIcon(type);

  const handleDeviceUnlock = (model: string) => {
    navigate(`/unlock/${encodeURIComponent(model)}`, { 
      state: { 
        serviceType: type,
        category: selectedCategory 
      } 
    });
  };

  const formattedCategory: Record<string, string> = {
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
  };

  return (

    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <Navigation />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {type ? `${type.toUpperCase()} Unlock` : 'Device Catalog'}
          </h1>
          <p className="text-xl text-blue-100">
            {type 
              ? `Select your specific ${type} model for unlocking`
              : 'Browse and unlock your Apple devices'}
          </p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-blue-50 rounded-xl p-6 pb-10 shadow-sm"
  >
    <div className="flex items-center space-x-4 mb-4">
      <HelpCircle className="w-8 h-8 text-blue-600" />
      <h2 className="text-2xl font-semibold text-blue-900">
        How to Unlock Your Device
      </h2>
    </div>
    
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Info,
            title: "1. Choose Device",
            description: "Select your specific Apple device from the catalog below."
          },
          {
            icon: Lock,
            title: "2. Select Unlock Service",
            description: "Pick the appropriate unlocking service for your needs."
          },
          {
            icon: Shield,
            title: "3. Complete Unlock",
            description: "Follow the guided process to unlock your device securely."
          }
        ].map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.2,
              duration: 0.3
            }}
            className="bg-white rounded-lg p-4 text-center shadow-md"
          >
            <div className="flex justify-center mb-3">
              <div className="bg-blue-100 rounded-full p-3">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>


      {/* Comprehensive Tutorial Section */}
      <AnimatePresence>
        {type && showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-6"
          >
            <div className="bg-blue-50 rounded-xl shadow-lg p-6 relative">
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-4 mb-6">
                <HelpCircle className="w-10 h-10 text-blue-600" />
                <h2 className="text-2xl font-bold text-blue-900 capitalize">
                  {type} Unlock Process
                </h2>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                {tutorialSteps[type as keyof typeof tutorialSteps].map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.3
                      }}
                      className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="bg-blue-100 rounded-full p-3">
                          <StepIcon className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-6">
          {(Object.keys(appleDevices) as Array<keyof typeof appleDevices>).map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
                selectedCategory === category 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category === 'iphone' && <Smartphone className="w-4 h-4 md:w-5 md:h-5" />}
              {category === 'ipad' && <Tablet className="w-4 h-4 md:w-5 md:h-5" />}
              {category === 'macbook' && <Laptop className="w-4 h-4 md:w-5 md:h-5" />}
              <span>{formattedCategory[category]}s</span>
                          </motion.button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDevices.map((device, index) => (
            <motion.div
              key={device.model}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5
              }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img 
                src={device.image} 
                alt={device.model} 
                className="w-full h-40 object-contain"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-center mb-2 line-clamp-2">{device.model}</h3>
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeviceUnlock(device.model)}
                    className="bg-blue-600 text-white px-4 py-2 rounded m-auto text-sm hover:bg-blue-700 transition-colors duration-300"
                  >
                    Unlock Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-md"
          >
            <p className="text-gray-600 mb-4">No devices found matching your search.</p>
          </motion.div>
        )}
      </div>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Our Unlocking Service?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Lock, 
                title: "Permanent Unlock", 
                description: "Unlock your device permanently, compatible with all iOS updates" 
              },
              { 
                icon: Shield, 
                title: "Safe & Secure", 
                description: "Official unlocking method that preserves your device warranty" 
              },
              { 
                icon: Globe, 
                title: "Worldwide Compatibility", 
                description: "Use your device with any carrier around the globe" 
              }
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.5
                }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default DeviceCatalog;

