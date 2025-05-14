
export interface HardwareItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  image: string;
  description: string;
  specs: Record<string, string>;
}

export type Category = 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'Motherboard' | 'PSU' | 'Case';

export const hardwareData: HardwareItem[] = [
  {
    id: '1',
    name: 'Intel Core i9-12900K',
    brand: 'Intel',
    category: 'CPU',
    price: 589.99,
    rating: 4.8,
    inStock: true,
    image: '/placeholder.svg',
    description: 'High-end desktop processor with 16 cores and 24 threads for extreme performance.',
    specs: {
      'Cores': '16 (8P+8E)',
      'Threads': '24',
      'Base Clock': '3.2 GHz',
      'Boost Clock': 'Up to 5.2 GHz',
      'TDP': '125W'
    }
  },
  {
    id: '2',
    name: 'AMD Ryzen 9 5950X',
    brand: 'AMD',
    category: 'CPU',
    price: 549.99,
    rating: 4.9,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Exceptional multi-core performance with 16 cores and 32 threads for demanding workloads.',
    specs: {
      'Cores': '16',
      'Threads': '32',
      'Base Clock': '3.4 GHz',
      'Boost Clock': 'Up to 4.9 GHz',
      'TDP': '105W'
    }
  },
  {
    id: '3',
    name: 'NVIDIA RTX 3080',
    brand: 'NVIDIA',
    category: 'GPU',
    price: 699.99,
    rating: 4.7,
    inStock: false,
    image: '/placeholder.svg',
    description: 'High-performance graphics card with ray tracing capabilities for gaming and content creation.',
    specs: {
      'CUDA Cores': '8704',
      'Memory': '10GB GDDR6X',
      'Memory Interface': '320-bit',
      'Boost Clock': '1.71 GHz',
      'TDP': '320W'
    }
  },
  {
    id: '4',
    name: 'AMD Radeon RX 6800 XT',
    brand: 'AMD',
    category: 'GPU',
    price: 649.99,
    rating: 4.6,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Powerful graphics card with high frame rates for 4K gaming and content creation.',
    specs: {
      'Stream Processors': '4608',
      'Memory': '16GB GDDR6',
      'Memory Interface': '256-bit',
      'Game Clock': '2015 MHz',
      'TDP': '300W'
    }
  },
  {
    id: '5',
    name: 'Corsair Vengeance RGB Pro 32GB',
    brand: 'Corsair',
    category: 'RAM',
    price: 159.99,
    rating: 4.8,
    inStock: true,
    image: '/placeholder.svg',
    description: 'High-performance memory with RGB lighting for gaming and productivity.',
    specs: {
      'Capacity': '32GB (2x16GB)',
      'Speed': '3600MHz',
      'Latency': 'CL18',
      'RGB': 'Yes',
      'Voltage': '1.35V'
    }
  },
  {
    id: '6',
    name: 'Samsung 980 Pro 1TB',
    brand: 'Samsung',
    category: 'Storage',
    price: 189.99,
    rating: 4.9,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Ultra-fast NVMe SSD for professional workloads and gaming.',
    specs: {
      'Capacity': '1TB',
      'Interface': 'PCIe 4.0 x4',
      'Sequential Read': '7,000 MB/s',
      'Sequential Write': '5,000 MB/s',
      'Form Factor': 'M.2 2280'
    }
  },
  {
    id: '7',
    name: 'ASUS ROG Strix X570-E Gaming',
    brand: 'ASUS',
    category: 'Motherboard',
    price: 329.99,
    rating: 4.7,
    inStock: true,
    image: '/placeholder.svg',
    description: 'High-end AMD motherboard with PCIe 4.0 and robust power delivery.',
    specs: {
      'Socket': 'AM4',
      'Chipset': 'X570',
      'Memory Support': 'DDR4 4400MHz',
      'PCIe': '4.0',
      'Form Factor': 'ATX'
    }
  },
  {
    id: '8',
    name: 'EVGA SuperNOVA 850 G5',
    brand: 'EVGA',
    category: 'PSU',
    price: 149.99,
    rating: 4.8,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Fully modular power supply with 80+ Gold efficiency certification.',
    specs: {
      'Wattage': '850W',
      'Efficiency': '80+ Gold',
      'Modularity': 'Fully Modular',
      'Fan Size': '135mm Fluid Dynamic Bearing',
      'Warranty': '10 Years'
    }
  },
  {
    id: '9',
    name: 'Lian Li PC-O11 Dynamic',
    brand: 'Lian Li',
    category: 'Case',
    price: 149.99,
    rating: 4.9,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Premium case with excellent airflow and showcase design.',
    specs: {
      'Form Factor': 'Mid Tower',
      'Motherboard Support': 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      'Front I/O': 'USB 3.0 x2, USB-C, Audio',
      'Drive Bays': '3x 3.5", 6x 2.5"',
      'Radiator Support': 'Up to 360mm'
    }
  },
  {
    id: '10',
    name: 'Crucial Ballistix 16GB',
    brand: 'Crucial',
    category: 'RAM',
    price: 79.99,
    rating: 4.5,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Reliable memory for gaming and everyday computing tasks.',
    specs: {
      'Capacity': '16GB (2x8GB)',
      'Speed': '3200MHz',
      'Latency': 'CL16',
      'RGB': 'No',
      'Voltage': '1.35V'
    }
  },
  {
    id: '11',
    name: 'Western Digital Black SN850 2TB',
    brand: 'Western Digital',
    category: 'Storage',
    price: 299.99,
    rating: 4.8,
    inStock: true,
    image: '/placeholder.svg',
    description: 'High-capacity NVMe SSD for gaming and professional use.',
    specs: {
      'Capacity': '2TB',
      'Interface': 'PCIe 4.0 x4',
      'Sequential Read': '7,000 MB/s',
      'Sequential Write': '5,300 MB/s',
      'Form Factor': 'M.2 2280'
    }
  },
  {
    id: '12',
    name: 'MSI MAG B550 Tomahawk',
    brand: 'MSI',
    category: 'Motherboard',
    price: 179.99,
    rating: 4.6,
    inStock: true,
    image: '/placeholder.svg',
    description: 'Mid-range AMD motherboard with solid features and reliability.',
    specs: {
      'Socket': 'AM4',
      'Chipset': 'B550',
      'Memory Support': 'DDR4 4400MHz+',
      'PCIe': '4.0',
      'Form Factor': 'ATX'
    }
  },
];

export const categories: Category[] = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'PSU', 'Case'];

export const brands: string[] = [
  'Intel',
  'AMD',
  'NVIDIA',
  'Corsair',
  'Samsung',
  'Western Digital',
  'ASUS',
  'MSI',
  'EVGA',
  'Lian Li',
  'Crucial'
];
