import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, Award, Clock, Globe, Users, 
  Phone, MessageSquare, Smartphone, Tablet, Laptop
} from 'lucide-react';
import DeviceCard from './DeviceCard';
import SearchBar from './SearchBar';
import HeaderSlider from './HeaderSlider';
import Navigation from './Navigation';
import IMEIChecker from './IMEIChecker';
import Footer from './Footer';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const appleDevices = {
  iphone: [
    { model: "iPhone 16 Pro Max", price: "$74.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_pro_max_desert_1_539c7c47.jpg" },
    { model: "iPhone 8 Plus", price: "$34.99", image: "https://i5.walmartimages.com/asr/61cbeba7-8bca-4062-b278-673019d304f8_1.44b845bf2c88872f7c7310a0d40bc0e7.jpeg" },
    { model: "iPhone 12 Pro", price: "$49.99", image: "https://alo.md/media/media/enter-apple-iphone-12-pro-158-mkstzqh.webp" },
    { model: "iPhone 16", price: "$59.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_16_ultramarine_1_2598b2a3.jpg" },
    { model: "iPhone 15 Pro Max", price: "$69.99", image: "https://cdn0.it4profit.com/s3size/rt:fill/w:900/h:900/g:no/el:1/f:webp/plain/s3://cms/product/86/e8/86e83cf2fedc8ed7ad4ddb3452d06b66/250331120227455325.webp" },
    { model: "iPhone 15 Pro", price: "$64.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_15_pro_natural_titanium_pdp_image_position_1_wwen_fc0946e7.jpg" },
    { model: "iPhone 11", price: "$39.99", image: "https://alo.md/media/media/seoimagesiphone-11-4-gb-128-gb-black-026-luwndcv-1.webp" },
    { model: "iPhone 15", price: "$54.99", image: "https://lcdn.altex.ro/media/catalog/product/a/p/apple_iphone_15_black_1_7416a980.jpg" },
    { model: "iPhone 14 Pro Max", price: "$64.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_14_pro_silver-1_56a46342.jpg" },
    { model: "iPhone SE (3rd gen)", price: "$34.99", image: "https://www.goblue.dk/images/Apple%20iPhone%20SE%202022%205G%2064GB%20-%20Red%2001-p.jpg" },
    { model: "iPhone XR", price: "$34.99", image: "https://i2.storeland.net/3/634/206336045/afacdb/smartfon-apple-iphone-xr.jpg" },
    { model: "iPhone 14", price: "$49.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/i/p/16fa6a9aef7ffd6209d5fd9338ffa0b1/iphone_14_purple-1_3df48088.jpg" }
  ],
  macbook: [
    { model: "MacBook Pro M4 (2025)", price: "$74.99", image: "https://inventstore.in/wp-content/uploads/2024/11/2-scaled.webp" },
{ model: "MacBook Air M4 (2025)", price: "$74.99", image: "https://lcdn.altex.ro/resize/media/catalog/product/m/a/16fa6a9aef7ffd6209d5fd9338ffa0b1/macbook_air_13_inch_m4_midnight_1_b1bf9b26.jpg" },
{ model: "MacBook Pro M3 (2024)", price: "$69.99", image: "https://idestiny.in/wp-content/uploads/2024/10/Macbook-Pro-16_-600x600.png" },
{ model: "MacBook Air M3 (2024)", price: "$59.99", image: "https://techzone.by/wp-content/uploads/2024/03/Apple-MacBook-Air-13-M3-2024-Midnight-1-min.png" },
{ model: "MacBook Pro M2 (2023)", price: "$64.99", image: "https://s3.ap-southeast-1.amazonaws.com/uploads-store/uploads/all/Bu04z64BCYaaDCVhrsBcmlgiPbxkKEdegvNg1B1o.png" },
{ model: "MacBook Air M2 (2023)", price: "$54.99", image: "https://images.shopkees.com/uploads/cdn/images/1000/9472077453_1655454923.jpg" },
{ model: "MacBook Pro M1 (2020)", price: "$59.99", image: "https://i.simpalsmedia.com/thumbor/500x0/i.simpalsmedia.com/marketplace/products/original/5922242252ed0e05fcf45269c1e60f74.jpg" },
{ model: "MacBook Air M1 (2020)", price: "$49.99", image: "https://5.imimg.com/data5/SELLER/Default/2024/4/414074292/OQ/RG/UD/35721490/apple-macbook-air-500x500.png" },
  ],
  ipad: [
    { model: "iPad Pro 13-inch (1st gen, 2024)", price: "$59.99", image: "https://www.imagineonline.store/cdn/shop/files/iPad_Pro_13_M4_Cellular_Silver_PDP_Image_Position_1b__en-IN_dd2e2a82-05c9-4fc0-9714-0611d65872d3.jpg?v=1716466657&width=823" },
{ model: "iPad Pro 11-inch (5th gen, 2024)", price: "$54.99", image: "https://www.machines.com.my/cdn/shop/products/iPad_Pro_Wi-Fi_11_in_4th_Gen_Silver_PDP_Image_Position-1b__SG.jpg?v=1705419289" },
{ model: "iPad Pro 12.9-inch (6th gen, 2022)", price: "$54.99", image: "https://alephksa.com/cdn/shop/files/iPad_Pro_12_9_inch_Wi-Fi_Space_Gray_PDP_Image_Position-1b_EN_2a446aae-b0f2-477f-95a2-6e2c27c1bbe9.jpg?v=1695930274&width=1445" },
{ model: "iPad Pro 11-inch (4th gen, 2022)", price: "$49.99", image: "https://www.machines.com.my/cdn/shop/products/iPad_Pro_Wi-Fi_11_in_4th_Gen_Silver_PDP_Image_Position-1b__SG_b73779cf-0c6e-4008-8023-92d7d0f26ce4_450x.jpg?v=1705418542" },
{ model: "iPad Pro 9.7-inch (2016)", price: "$34.99", image: "https://d2e6ccujb3mkqf.cloudfront.net/50f4fbbd-a9ca-4de1-8b87-6f4f861745c5-1_add7ec61-fc96-488f-bd61-c55287aab95e.jpg" },
{ model: "iPad Pro 12.9-inch (1st gen, 2015)", price: "$39.99", image: "https://istorepreowned.co.za/cdn/shop/products/iPad_Pro_12.9-inch_2015_1stGen-Space_Grey_c665a954-f7e7-424f-b616-1a037a401813.png?v=1710873602" },

// iPad Air
{ model: "iPad Air (6th gen, 2024)", price: "$44.99", image: "https://www.costco.co.uk/medias/sys_master/images/hf0/hd5/238984826191902.jpg" },
{ model: "iPad Air (5th gen, 2022)", price: "$39.99", image: "https://images.shopkees.com/uploads/cdn/images/1000/6784996745_1646891783.jpg" },
  ]
};

const benefits = [
  {
    icon: Award,
    title: "Trusted Reputation",
    description: "The recommended method by phone manufacturers and network providers worldwide."
  },
  {
    icon: Shield,
    title: "100% Safe & Legal",
    description: "Official unlocking method that maintains your warranty and device integrity."
  },
  {
    icon: CheckCircle,
    title: "Guaranteed Results",
    description: "Your satisfaction is guaranteed or your money back, no questions asked."
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Most devices are unlocked within 24 hours of request submission."
  },
  {
    icon: Phone,
    title: "Keep Your Phone",
    description: "Remote unlocking process - your phone never leaves your possession."
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description: "Expert assistance available around the clock via chat, phone, or email."
  },
  {
    icon: Globe,
    title: "Worldwide Freedom",
    description: "Use your phone with any carrier anywhere in the world."
  },
  {
    icon: Users,
    title: "Proven Experience",
    description: "Over 5 million successful unlocks and counting."
  }
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("iphone");
  
  const filteredDevices = appleDevices[selectedCategory as keyof typeof appleDevices].filter(device => 
    device.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  const handleSeeAllDevices = () => {
    navigate("/device-catalog");
  };

  const handleDeviceUnlock = (model: string) => {
    navigate(`/unlock/${encodeURIComponent(model)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeaderSlider />
      
      <IMEIChecker />


      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-6">
          {[
            { category: "iphone", icon: Smartphone, label: "iPhones" },
            { category: "ipad", icon: Tablet, label: "iPads" },
            { category: "macbook", icon: Laptop, label: "MacBooks" }
          ].map(({ category, icon: Icon, label }) => (
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
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDevices.map((device, index) => (
            <motion.div
              key={device.model}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                <h3 className="text-sm font-semibold mb-2 line-clamp-2">{device.model}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">{device.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeviceUnlock(device.model)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors duration-300"
                  >
                    Unlock Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
          </div>
     

      <div className="flex justify-center mt-8 mb-20">
          <motion.button
            onClick={handleSeeAllDevices}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <span>See All Devices</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

      <section className="bg-gray-100 py-12 md:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Why Choose iUnlockExpert?</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the safest, fastest, and most reliable phone unlocking service in the industry.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                <div className="flex items-start">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </motion.div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        
      </section>

      

      <Footer />
    </div>
  );
};

export default HomePage;
