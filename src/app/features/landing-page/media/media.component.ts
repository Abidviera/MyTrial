import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  coverage: string[];
}

interface Stat {
  number: string;
  label: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
}

interface Testimonial {
  name: string;
  position: string;
  quote: string;
}

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client: string;
  image: string;
  description?: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  featured?: boolean;
}

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

interface BookingData {
  name: string;
  email: string;
  service: string;
  duration: number;
  addons: {
    drone: boolean;
    virtual: boolean;
    sameDay: boolean;
    extended: boolean;
  };
}

interface PriceAddons {
  drone: boolean;
  sameDay: boolean;
  virtual: boolean;
  extended: boolean;
}
@Component({
  selector: 'app-media',
  standalone: false,
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent {
 activeSection: string = 'home';
  mobileMenuOpen: boolean = false;
  selectedService: string | null = null;
  activeFilter: string = 'all';
  selectedImage: PortfolioProject | null = null;
  selectedServiceCalc: string = 'events';
  durationHours: number = 4;
  basePrice: number = 2200;
  calculatedPrice: number = 2200;
  
  formData: FormData = {
    name: '',
    email: '',
    service: '',
    message: ''
  };

  bookingData: BookingData = {
    name: '',
    email: '',
    service: 'event-consultation',
    duration: 4,
    addons: {
      drone: false,
      virtual: false,
      sameDay: false,
      extended: false
    }
  };

  addons: PriceAddons = {
    drone: false,
    sameDay: false,
    virtual: false,
    extended: false
  };

  services: Service[] = [
    {
      id: 'events',
      title: 'Events & Exhibitions',
      tagline: 'WHERE SCALE MEETS PRECISION',
      description: 'From the world\'s largest energy exhibitions to intimate corporate gatherings, we document every angle, every moment, every detail.',
      image: 'https://images.unsplash.com/photo-1760965254674-0a3ab2e43d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['ADIPEC, IDEX, Gulfood', 'Corporate Conferences', 'Government Events', 'Product Launches', 'Trade Shows', 'Award Ceremonies']
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Hospital',
      tagline: 'HEALING THROUGH VISUAL TRUST',
      description: 'Healthcare photography that demands sensitivity, compliance, and respect for patient dignity while showcasing medical excellence.',
      image: 'https://images.unsplash.com/photo-1720180246107-cf498760f1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['Infrastructure Photography', 'Medical Equipment', 'Staff & Doctor Portraits', 'Patient Care Stories', 'Healthcare Events', 'Compliance Documentation']
    },
    {
      id: 'fashion',
      title: 'Fashion & Modeling',
      tagline: 'STYLE MEETS SUBSTANCE',
      description: 'Fashion photography that captures the essence of design while telling compelling visual stories that elevate your brand.',
      image: 'https://images.unsplash.com/photo-1660018322139-0e58555df00d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['Editorial Fashion', 'Commercial Campaigns', 'Model Portfolios', 'Lookbook Production', 'Fashion Shows', 'E-commerce Photography']
    },
    {
      id: 'sports',
      title: 'Sports Photography',
      tagline: 'FREEZING THE MOMENT OF VICTORY',
      description: 'Capturing the intensity of competition, the grace of athletic movement, and the raw emotion of triumph and defeat.',
      image: 'https://images.unsplash.com/photo-1729871337531-249297613423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['Football, Basketball, Tennis', 'Athletics & Track', 'Martial Arts', 'Cycling & Running', 'Water Sports', 'Youth Sports']
    },
    {
      id: 'product',
      title: 'Product & Advertisement',
      tagline: 'PRODUCTS THAT SELL THEMSELVES',
      description: 'Technical perfection combined with creative vision to produce images that stop scrollers and convert browsers into buyers.',
      image: 'https://images.unsplash.com/photo-1719176010035-17729577d496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['Electronics & Technology', 'Jewelry & Watches', 'Cosmetics & Beauty', 'Food & Beverage', 'Automotive', 'Luxury Goods']
    },
    {
      id: 'weddings',
      title: 'Weddings & Private Events',
      tagline: 'YOUR STORY, BEAUTIFULLY TOLD',
      description: 'Once-in-a-lifetime moments preserved with artistry and care, blending into your celebration while capturing authentic emotions.',
      image: 'https://images.unsplash.com/photo-1637150117590-d89ecc85dd4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      coverage: ['Emirati & Khaleeji Weddings', 'International Weddings', 'Engagement Ceremonies', 'Pre-wedding Shoots', 'Birthday Celebrations', 'Family Portraits']
    }
  ];

  stats: Stat[] = [
    { number: '500+', label: 'Projects Completed' },
    { number: '15+', label: 'Industries Served' },
    { number: '50+', label: 'Countries Covered' },
    { number: '100%', label: 'Client Satisfaction' }
  ];

  process: ProcessStep[] = [
    {
      step: '01',
      title: 'INITIAL CONSULTATION',
      description: 'Understanding your needs, vision, objectives, timelines & budgets',
      duration: 'FREE'
    },
    {
      step: '02',
      title: 'PROPOSAL & PLANNING',
      description: 'Detailed scope, shot list, concept boards, timeline & transparent pricing',
      duration: '2-3 DAYS'
    },
    {
      step: '03',
      title: 'PRE-PRODUCTION',
      description: 'Location scouting, talent coordination, equipment prep, permit acquisition',
      duration: '1-2 WEEKS'
    },
    {
      step: '04',
      title: 'SHOOT DAY',
      description: 'Professional execution, on-set collaboration, quality control, backup systems',
      duration: 'AS PLANNED'
    },
    {
      step: '05',
      title: 'POST-PRODUCTION',
      description: 'Photo selection, professional editing, retouching, color grading',
      duration: '3-7 DAYS'
    },
    {
      step: '06',
      title: 'DELIVERY',
      description: 'High-resolution files, web-optimized versions, organized structure',
      duration: 'IMMEDIATE'
    }
  ];

  industries: string[] = [
    'Energy & Oil/Gas',
    'Healthcare & Medical',
    'Hospitality & Tourism',
    'Fashion & Retail',
    'Sports & Entertainment',
    'Government & Public Sector',
    'Real Estate & Construction',
    'Education',
    'Technology & Innovation',
    'Food & Beverage',
    'Automotive',
    'Finance & Banking'
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Dr. Ahmed Al Mansoori',
      position: 'Medical Director, Leading Abu Dhabi Hospital',
      quote: 'MarkeMedia transformed our hospital\'s visual identity. Their professionalism and understanding of healthcare environments is exceptional.'
    },
    {
      name: 'Sarah Mitchell',
      position: 'Event Manager, Global Energy Conference',
      quote: 'Covering ADIPEC for 4 days requires precision and stamina. MarkeMedia delivered beyond expectations with comprehensive coverage.'
    },
    {
      name: 'Fatima Al Hashimi',
      position: 'Fashion Designer',
      quote: 'Their fashion photography captures not just clothing, but emotion and story. Working with MarkeMedia elevated my entire brand.'
    }
  ];

  portfolioProjects: PortfolioProject[] = [
    {
      id: '1',
      title: 'ADIPEC 2024',
      category: 'EVENTS & EXHIBITIONS',
      client: 'World\'s Leading Energy Exhibition',
      image: 'https://images.unsplash.com/photo-1760965254674-0a3ab2e43d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Comprehensive coverage of the world\'s largest energy exhibition, capturing keynote speeches, exhibitions, and networking events.',
      camera: 'Sony α7R IV',
      lens: '24-70mm f/2.8 GM',
      aperture: 'f/4',
      featured: true
    },
    {
      id: '2',
      title: 'Premier Medical Center',
      category: 'HEALTHCARE',
      client: 'Healthcare Infrastructure',
      image: 'https://images.unsplash.com/photo-1720180246107-cf498760f1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Modern hospital facility documentation showcasing advanced medical technology and compassionate care environments.',
      camera: 'Canon EOS R5',
      lens: '16-35mm f/2.8',
      aperture: 'f/5.6'
    },
    {
      id: '3',
      title: 'Desert Couture',
      category: 'FASHION',
      client: 'Editorial Fashion Series',
      image: 'https://images.unsplash.com/photo-1660018322139-0e58555df00d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Editorial fashion shoot blending traditional Emirati elements with contemporary haute couture in desert landscapes.',
      camera: 'Sony α7 IV',
      lens: '85mm f/1.4 GM',
      aperture: 'f/2.8'
    },
    {
      id: '4',
      title: 'Athletic Excellence',
      category: 'SPORTS',
      client: 'Sports Tournament Coverage',
      image: 'https://images.unsplash.com/photo-1729871337531-249297613423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Action-packed coverage of regional sports tournament capturing athletes\' determination and victory moments.',
      camera: 'Canon EOS R3',
      lens: '70-200mm f/2.8',
      aperture: 'f/2.8'
    },
    {
      id: '5',
      title: 'Luxury Timepieces',
      category: 'PRODUCT',
      client: 'E-commerce Campaign',
      image: 'https://images.unsplash.com/photo-1719176010035-17729577d496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'High-end product photography for luxury watch brand, emphasizing craftsmanship and detail.',
      camera: 'Phase One XT',
      lens: '120mm f/4',
      aperture: 'f/11'
    },
    {
      id: '6',
      title: 'Emirati Wedding',
      category: 'WEDDINGS',
      client: 'Traditional Celebration',
      image: 'https://images.unsplash.com/photo-1637150117590-d89ecc85dd4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      description: 'Documentation of traditional Emirati wedding ceremony and celebrations, preserving cultural heritage.',
      camera: 'Sony α7S III',
      lens: '35mm f/1.4',
      aperture: 'f/2'
    }
  ];

  instagramPosts: InstagramPost[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=500',
      caption: 'Behind the scenes at ADIPEC',
      likes: 245,
      comments: 12
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500',
      caption: 'New gear day!',
      likes: 189,
      comments: 8
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=500',
      caption: 'Studio setup for fashion shoot',
      likes: 312,
      comments: 24
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500',
      caption: 'Aerial view of Abu Dhabi',
      likes: 456,
      comments: 36
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1660018322139-0e58555df00d?auto=format&fit=crop&w=500',
      caption: 'Fashion editorial preview',
      likes: 278,
      comments: 19
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1729871337531-249297613423?auto=format&fit=crop&w=500',
      caption: 'Sports action shot',
      likes: 198,
      comments: 15
    }
  ];

  clientProjects: number = 47;
  hoursShot: number = 1250;
  photosDelivered: number = 12500;

  get filteredProjects(): PortfolioProject[] {
    if (this.activeFilter === 'all') {
      return this.portfolioProjects;
    }
    return this.portfolioProjects.filter(project => 
      project.category.toLowerCase().includes(this.activeFilter)
    );
  }

  ngOnInit(): void {
    this.updatePrice();
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    this.mobileMenuOpen = false;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleService(serviceId: string): void {
    this.selectedService = this.selectedService === serviceId ? null : serviceId;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  openImageViewer(project: PortfolioProject): void {
    this.selectedImage = project;
    document.body.style.overflow = 'hidden';
  }

  closeImageViewer(): void {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }

  selectServiceCalc(service: string): void {
    this.selectedServiceCalc = service;
    this.updatePrice();
  }

  updatePrice(): void {
    // Calculate base price based on duration
    let base = 0;
    switch (this.durationHours) {
      case 2: base = 1200; break;
      case 4: base = 2200; break;
      case 6: base = 3200; break;
      case 8: base = 4500; break;
      case 12: base = 8000; break;
      default: base = 2200;
    }
    
    // Apply service multiplier
    const serviceMultipliers: { [key: string]: number } = {
      'events': 1.0,
      'healthcare': 1.2,
      'fashion': 1.3,
      'sports': 1.1,
      'product': 1.0,
      'weddings': 1.4
    };
    
    const multiplier = serviceMultipliers[this.selectedServiceCalc] || 1.0;
    base = base * multiplier;
    
    this.basePrice = Math.round(base);
    
    // Calculate addons
    let addonTotal = 0;
    if (this.addons.drone) addonTotal += 300;
    if (this.addons.sameDay) addonTotal += 200;
    if (this.addons.virtual) addonTotal += 500;
    if (this.addons.extended) addonTotal += 400;
    
    this.calculatedPrice = this.basePrice + addonTotal;
  }

  selectPackage(packageType: string): void {
    switch (packageType) {
      case 'basic':
        this.durationHours = 2;
        this.addons.drone = false;
        this.addons.sameDay = false;
        this.addons.virtual = false;
        this.addons.extended = false;
        break;
      case 'professional':
        this.durationHours = 4;
        this.addons.drone = false;
        this.addons.sameDay = false;
        this.addons.virtual = false;
        this.addons.extended = false;
        break;
      case 'enterprise':
        this.durationHours = 8;
        this.addons.drone = true;
        this.addons.sameDay = false;
        this.addons.virtual = false;
        this.addons.extended = true;
        break;
    }
    this.updatePrice();
    this.scrollToSection('booking');
  }

  submitBooking(): void {
    if (!this.bookingData.name || !this.bookingData.email || !this.bookingData.service) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Calculate booking price
    let bookingPrice = 0;
    switch (this.bookingData.duration) {
      case 2: bookingPrice = 1200; break;
      case 4: bookingPrice = 2200; break;
      case 8: bookingPrice = 4500; break;
      case 16: bookingPrice = 8000; break;
      default: bookingPrice = 2200;
    }
    
    // Add addons
    if (this.bookingData.addons.drone) bookingPrice += 300;
    if (this.bookingData.addons.virtual) bookingPrice += 500;
    if (this.bookingData.addons.sameDay) bookingPrice += 200;
    if (this.bookingData.addons.extended) bookingPrice += 400;
    
    // In a real app, you would redirect to payment gateway
    alert(`Thank you for your booking! A deposit of $${bookingPrice * 0.3} is required. We will contact you shortly.`);
    
    // Reset form
    this.bookingData = {
      name: '',
      email: '',
      service: 'event-consultation',
      duration: 4,
      addons: {
        drone: false,
        virtual: false,
        sameDay: false,
        extended: false
      }
    };
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.name || !this.formData.email || !this.formData.service || !this.formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Thank you for your interest! We will contact you soon.');
    this.formData = { name: '', email: '', service: '', message: '' };
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const sections = ['home', 'services', 'portfolio', 'process', 'about', 'contact', 'booking'];
    const scrollPosition = window.pageYOffset + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeImageViewer();
  }
}
