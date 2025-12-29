import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

declare var gsap: any;
declare var ScrollTrigger: any;
declare var SplitText: any;

interface SplitTextInstance {
  words: HTMLElement[];
}

interface VideoSection {
  service: string;
  featured: string;
  category: string;
  videoUrl: string;
  posterUrl?: string;
}

interface ServiceDetail {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface FeaturedWork {
  title: string;
  category: string;
  description: string;
  image: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
}
@Component({
  selector: 'app-media2',
  standalone: false,
  templateUrl: './media2.component.html',
  styleUrl: './media2.component.scss'
})
export class Media2Component {
 private lenis: Lenis | null = null;
  private soundManager: any;
  private splitTexts: { [key: string]: SplitTextInstance } = {};
  private currentSection = 0;
  private isAnimating = false;
  private isSnapping = false;
  private lastProgress = 0;
  private scrollDirection = 0;
  private sectionPositions: number[] = [];
  private mainScrollTrigger: any;
  private isBrowser: boolean;
  private videoElements: HTMLVideoElement[] = [];
  private videosLoaded = 0;
  private totalVideos = 6;
  private cursorFollower: HTMLElement | null = null;
  private animatedSections: Set<string> = new Set();

  menuOpen = false;
  currentTestimonial = 0;
  testimonialOffset = 0;
  
  sections: VideoSection[] = [
    { 
      service: 'Events', 
      featured: 'Captured Moments', 
      category: 'Exhibitions',
      videoUrl: 'HERO/exhibition.mp4',
      posterUrl: 'HERO/event.jpg'
    },
    { 
      service: 'Hospital', 
      featured: 'Medical Excellence', 
      category: 'Healthcare',
      videoUrl: 'HERO/hospital.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80'
    },
    { 
      service: 'Fashion', 
      featured: 'Style Stories', 
      category: 'Modeling',
      videoUrl: 'HERO/fashion.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80'
    },
    { 
      service: 'Sports', 
      featured: 'Action Shots', 
      category: 'Athletics',
      videoUrl: 'HERO/F1.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80'
    },
    { 
      service: 'Product', 
      featured: 'Commercial Vision', 
      category: 'Advertisement',
      videoUrl: 'HERO/advertisement.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80'
    },
    { 
      service: 'Weddings', 
      featured: 'Love Stories', 
      category: 'Celebrations',
      videoUrl: 'HERO/Wedding.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
    }
  ];

  serviceDetails: ServiceDetail[] = [
    {
      icon: '🎉',
      title: 'Event Coverage',
      description: 'From corporate galas to music festivals, we capture the energy and essence of every event.',
      features: ['Live Coverage', 'Highlight Reels', 'Multi-Cam Setup']
    },
    {
      icon: '🏥',
      title: 'Medical Documentation',
      description: 'Professional medical photography and videography for hospitals, clinics, and healthcare institutions.',
      features: ['Surgical Documentation', 'Facility Tours', 'Patient Stories']
    },
    {
      icon: '👗',
      title: 'Fashion & Editorial',
      description: 'High-end fashion photography and videography that brings your brand to life.',
      features: ['Runway Coverage', 'Lookbooks', 'Campaign Videos']
    },
    {
      icon: '⚡',
      title: 'Sports Photography',
      description: 'Dynamic action shots and highlight reels that capture the thrill of competition.',
      features: ['Action Shots', 'Team Photography', 'Event Highlights']
    },
    {
      icon: '📦',
      title: 'Product & Commercial',
      description: 'Stunning product photography and commercial videos that drive sales and engagement.',
      features: ['Product Showcase', 'Advertising', '3D Rendering']
    },
    {
      icon: '💍',
      title: 'Wedding Cinematography',
      description: 'Timeless wedding films that tell your unique love story with cinematic beauty.',
      features: ['Full-Day Coverage', 'Cinematic Edits', 'Drone Footage']
    }
  ];

  featuredWork: FeaturedWork[] = [
    {
      title: 'Tech Summit 2024',
      category: 'Event',
      description: 'Comprehensive coverage of the year\'s biggest tech conference',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
    },
    {
      title: 'City General Hospital',
      category: 'Medical',
      description: 'Professional facility and service documentation',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80'
    },
    {
      title: 'Urban Collection',
      category: 'Fashion',
      description: 'Street-style fashion campaign for emerging designers',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
    },
    {
      title: 'Championship Finals',
      category: 'Sports',
      description: 'High-energy coverage of the season finale',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    },
    {
      title: 'Luxury Watch Campaign',
      category: 'Product',
      description: 'Premium product photography for high-end timepieces',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    },
    {
      title: 'Sarah & Michael',
      category: 'Wedding',
      description: 'A beautiful destination wedding by the coast',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'
    }
  ];

  stats: Stat[] = [
    { value: '500+', label: 'Projects Completed' },
    { value: '200+', label: 'Happy Clients' },
    { value: '50+', label: 'Awards Won' },
    { value: '10+', label: 'Years Experience' }
  ];

  values: Value[] = [
    {
      icon: '🎯',
      title: 'Creative Excellence',
      description: 'We push creative boundaries to deliver visually stunning content that exceeds expectations.'
    },
    {
      icon: '⚡',
      title: 'Fast Turnaround',
      description: 'Quick delivery without compromising quality, meeting deadlines consistently.'
    },
    {
      icon: '🤝',
      title: 'Client-Focused',
      description: 'Your vision is our priority. We collaborate closely to bring your ideas to life.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: 'Mark Media transformed our brand identity with their exceptional photography. The attention to detail and creative vision exceeded all our expectations.',
      name: 'Alexandra Chen',
      role: 'Marketing Director, TechCorp',
      initials: 'AC'
    },
    {
      text: 'The wedding video they created for us is absolutely breathtaking. Every time we watch it, we relive the magic of our special day.',
      name: 'James & Emma Wilson',
      role: 'Wedding Clients',
      initials: 'JE'
    },
    {
      text: 'Professional, creative, and incredibly talented. Mark Media captured our event perfectly and delivered beyond what we imagined.',
      name: 'Robert Martinez',
      role: 'Event Coordinator',
      initials: 'RM'
    },
    {
      text: 'Their medical photography services helped us showcase our facility in the best light. Highly professional and detail-oriented.',
      name: 'Dr. Sarah Thompson',
      role: 'Chief Medical Officer',
      initials: 'ST'
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.initSoundManager();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          this.preloadVideos();
          this.initCursorFollower();
        });
      } else {
        this.preloadVideos();
        this.initCursorFollower();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.videoElements.forEach(video => {
      video.pause();
      video.src = '';
      video.load();
    });

    if (this.lenis) {
      this.lenis.destroy();
    }
    if (this.mainScrollTrigger) {
      this.mainScrollTrigger.kill();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Animate sections on scroll
    this.animateOnScroll();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser || !this.cursorFollower) return;
    
    gsap.to(this.cursorFollower, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  private initCursorFollower(): void {
    this.cursorFollower = document.getElementById('cursor-follower');
    if (this.cursorFollower) {
      gsap.set(this.cursorFollower, { opacity: 1 });
    }
  }

  private animateOnScroll(): void {
    const sections = [
      '.services-section',
      '.showcase-section',
      '.stats-section',
      '.about-section',
      '.testimonials-section',
      '.contact-section'
    ];

    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element || this.animatedSections.has(selector)) return;

      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.75;

      if (isVisible) {
        this.animatedSections.add(selector);
        this.animateSection(selector);
      }
    });
  }

  private animateSection(selector: string): void {
    if (selector === '.services-section') {
      this.animateServicesSection();
    } else if (selector === '.showcase-section') {
      this.animateShowcaseSection();
    } else if (selector === '.stats-section') {
      this.animateStatsSection();
    } else if (selector === '.about-section') {
      this.animateAboutSection();
    }
  }

  private animateServicesSection(): void {
    const titleLines = document.querySelectorAll('.services-section .title-line');
    gsap.to(titleLines, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    const serviceCards = document.querySelectorAll('.service-card');
    gsap.to(serviceCards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  private animateShowcaseSection(): void {
    const titleLines = document.querySelectorAll('.showcase-section .title-line');
    gsap.to(titleLines, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    const showcaseItems = document.querySelectorAll('.showcase-item');
    gsap.to(showcaseItems, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  private animateStatsSection(): void {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = stat.getAttribute('data-target') || '0';
      const numericValue = parseInt(target.replace(/\D/g, ''));
      const suffix = target.replace(/[0-9]/g, '');

      gsap.from(stat, {
        textContent: 0,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 },
        onUpdate: function() {
          const current = Math.round(parseFloat(stat.textContent || '0'));
          stat.textContent = current + suffix;
        }
      });
    });
  }

  private animateAboutSection(): void {
    const titleLines = document.querySelectorAll('.about-section .title-line');
    gsap.to(titleLines, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    const aboutText = document.querySelectorAll('.about-text p');
    gsap.to(aboutText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  private preloadVideos(): void {
    const loadingCounter = document.getElementById('loading-counter');
    let loadedCount = 0;

    this.sections.forEach((section, index) => {
      const video = document.getElementById(`background-video-${index}`) as HTMLVideoElement;
      if (!video) return;

      this.videoElements[index] = video;
      
      video.preload = 'auto';
      video.playsInline = true;
      video.muted = true;
      video.loop = true;
      
      const onCanPlay = () => {
        loadedCount++;
        const progress = Math.floor((loadedCount / this.totalVideos) * 100);
        if (loadingCounter) {
          loadingCounter.textContent = `[${progress.toString().padStart(2, '0')}]`;
        }
        
        if (loadedCount === this.totalVideos) {
          this.onAllVideosLoaded();
        }
        
        video.removeEventListener('canplaythrough', onCanPlay);
      };

      video.addEventListener('canplaythrough', onCanPlay);
      
      const onError = () => {
        console.error(`Failed to load video ${index}`);
        loadedCount++;
        if (loadedCount === this.totalVideos) {
          this.onAllVideosLoaded();
        }
        video.removeEventListener('error', onError);
      };
      
      video.addEventListener('error', onError);
      
      video.load();
    });
  }

  private onAllVideosLoaded(): void {
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 300);
  }

  private hideLoadingScreen(): void {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        loadingOverlay.style.display = 'none';
        this.initLenis();
        this.initPage();
      }
    });

    timeline
      .to('.logo-mask', {
        scaleY: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 0)
      .to('.logo-image', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      }, 0.3)
      .to('.glow-effect', {
        opacity: 1,
        scale: 1.2,
        duration: 1.5,
        ease: 'power2.out'
      }, 0.4);

    const chars = document.querySelectorAll('.char');
    timeline.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: {
        each: 0.05,
        from: 'start'
      },
      ease: 'power3.out'
    }, 0.8);

    timeline.to('.company-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 1.2);

    timeline.to('.loading-progress', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.4);

    timeline.to('.progress-bar', {
      width: '100%',
      duration: 0.8,
      ease: 'power2.inOut'
    }, 1.6);

    timeline.to('.loading-content', {
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 2.6)
    .to(loadingOverlay, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 2.8);
  }

  private initSoundManager(): void {
    this.soundManager = {
      sounds: {},
      isEnabled: false,
      loadSound: (name: string, url: string, volume = 0.3) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = volume;
        this.soundManager.sounds[name] = audio;
      },
      enableAudio: () => {
        if (!this.soundManager.isEnabled) {
          this.soundManager.isEnabled = true;
        }
      },
      play: (soundName: string, delay = 0) => {
        if (this.soundManager.isEnabled && this.soundManager.sounds[soundName]) {
          if (delay > 0) {
            setTimeout(() => {
              this.soundManager.sounds[soundName].currentTime = 0;
              this.soundManager.sounds[soundName].play().catch(() => {});
            }, delay);
          } else {
            this.soundManager.sounds[soundName].currentTime = 0;
            this.soundManager.sounds[soundName].play().catch(() => {});
          }
        }
      }
    };

    this.soundManager.loadSound('hover', 'https://assets.codepen.io/7558/click-reverb-001.mp3', 0.15);
    this.soundManager.loadSound('click', 'https://assets.codepen.io/7558/shutter-fx-001.mp3', 0.3);
    this.soundManager.loadSound('textChange', 'https://assets.codepen.io/7558/whoosh-fx-001.mp3', 0.3);
  }

  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });

    this.lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time: number) => {
      if (this.lenis) {
        this.lenis.raf(time * 1000);
      }
    });
    gsap.ticker.lagSmoothing(0);
  }

  private initPage(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof SplitText === 'undefined') {
      console.error('GSAP libraries not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    
    gsap.registerEase("customEase", function(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    });

    this.animateColumns();
    this.setupScrollTriggers();
    
    if (this.videoElements[0]) {
      this.videoElements[0].play().catch(() => {});
    }
  }

  private animateColumns(): void {
    const serviceItems = document.querySelectorAll('.service');
    const categoryItems = document.querySelectorAll('.category');
    
    serviceItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('loaded');
      }, index * 60);
    });
    
    categoryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('loaded');
      }, index * 60 + 200);
    });
  }

  private setupScrollTriggers(): void {
    const duration = 0.64;
    const fixedContainer = document.getElementById('fixed-container');
    const fixedSectionElement = document.querySelector('.fixed-section') as HTMLElement;
    const header = document.querySelector('.header');
    const content = document.querySelector('.content');
    const footer = document.getElementById('footer');
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');
    const featured = document.getElementById('featured');
    const progressFill = document.getElementById('progress-fill');

    const featuredContents = document.querySelectorAll('.featured-content');
    featuredContents.forEach((content, index) => {
      const h3 = content.querySelector('h3');
      if (h3) {
        const split = new SplitText(h3, {
          type: 'words',
          wordsClass: 'split-word'
        });
        this.splitTexts[`featured-${index}`] = split;
        
        split.words.forEach((word: HTMLElement) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'word-mask';
          wrapper.style.display = 'inline-block';
          wrapper.style.overflow = 'hidden';
          word.parentNode!.insertBefore(wrapper, word);
          wrapper.appendChild(word);
          
          if (index !== 0) {
            gsap.set(word, { yPercent: 100, opacity: 0 });
          } else {
            gsap.set(word, { yPercent: 0, opacity: 1 });
          }
        });
      }
    });

    gsap.set(fixedContainer, { height: '100vh' });

    const fixedSectionTop = fixedSectionElement.offsetTop;
    const fixedSectionHeight = fixedSectionElement.offsetHeight;
    
    for (let i = 0; i < 6; i++) {
      this.sectionPositions.push(fixedSectionTop + (fixedSectionHeight * i) / 6);
    }

    this.mainScrollTrigger = ScrollTrigger.create({
      trigger: '.fixed-section',
      start: 'top top',
      end: 'bottom bottom',
      pin: '.fixed-container',
      pinSpacing: true,
      onUpdate: (self: any) => {
        if (this.isSnapping) return;
        
        const progress = self.progress;
        const progressDelta = progress - this.lastProgress;
        
        if (Math.abs(progressDelta) > 0.001) {
          this.scrollDirection = progressDelta > 0 ? 1 : -1;
        }
        
        const targetSection = Math.min(5, Math.floor(progress * 6));
        
        if (targetSection !== this.currentSection && !this.isAnimating) {
          const nextSection = this.currentSection + (targetSection > this.currentSection ? 1 : -1);
          this.snapToSection(nextSection);
        }
        
        this.lastProgress = progress;
        const sectionProgress = this.currentSection / 5;
        if (progressFill) {
          progressFill.style.width = `${sectionProgress * 100}%`;
        }
      }
    });

    ScrollTrigger.create({
      trigger: '.end-section',
      start: 'top center',
      end: 'bottom bottom',
      onUpdate: (self: any) => {
        if (self.progress > 0.1) {
          footer?.classList.add('blur');
          leftColumn?.classList.add('blur');
          rightColumn?.classList.add('blur');
          featured?.classList.add('blur');
          
          const newHeight = Math.max(0, 100 - ((self.progress - 0.1) / 0.9) * 100);
          gsap.to(fixedContainer, {
            height: `${newHeight}vh`,
            duration: 0.1,
            ease: 'power1.out'
          });
          
          const moveY = (-(self.progress - 0.1) / 0.9) * 200;
          gsap.to(header, { y: moveY * 1.5, duration: 0.1, ease: 'power1.out' });
          gsap.to(content, { y: `calc(${moveY}px + (-50%))`, duration: 0.1, ease: 'power1.out' });
          gsap.to(footer, { y: moveY * 0.5, duration: 0.1, ease: 'power1.out' });
        } else {
          footer?.classList.remove('blur');
          leftColumn?.classList.remove('blur');
          rightColumn?.classList.remove('blur');
          featured?.classList.remove('blur');
          
          gsap.to(fixedContainer, { height: '100vh', duration: 0.1, ease: 'power1.out' });
          gsap.to(header, { y: 0, duration: 0.1, ease: 'power1.out' });
          gsap.to(content, { y: '-50%', duration: 0.1, ease: 'power1.out' });
          gsap.to(footer, { y: 0, duration: 0.1, ease: 'power1.out' });
        }
      }
    });

    this.updateProgressNumbers();
  }

  private snapToSection(targetSection: number): void {
    if (targetSection < 0 || targetSection > 5 || targetSection === this.currentSection || this.isAnimating || !this.lenis) {
      return;
    }
    
    this.isSnapping = true;
    this.changeSection(targetSection);
    
    const targetPosition = this.sectionPositions[targetSection];
    this.lenis.scrollTo(targetPosition, {
      duration: 0.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => {
        this.isSnapping = false;
      }
    });
  }

  navigateToSection(index: number): void {
    if (index === this.currentSection || this.isAnimating || this.isSnapping || !this.lenis) return;
    
    this.soundManager.enableAudio();
    this.soundManager.play('click');
    
    this.isSnapping = true;
    const targetPosition = this.sectionPositions[index];
    
    this.changeSection(index);
    
    this.lenis.scrollTo(targetPosition, {
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => {
        this.isSnapping = false;
      }
    });
  }

  onItemHover(): void {
    this.soundManager.enableAudio();
    this.soundManager.play('hover');
  }

  private changeSection(newSection: number): void {
    if (newSection === this.currentSection || this.isAnimating) return;
    
    this.isAnimating = true;
    const isScrollingDown = newSection > this.currentSection;
    const previousSection = this.currentSection;
    this.currentSection = newSection;
    
    this.updateProgressNumbers();
    
    const duration = 0.64;
    const parallaxAmount = 5;
    const progressFill = document.getElementById('progress-fill');
    const sectionProgress = this.currentSection / 5;
    if (progressFill) {
      progressFill.style.width = `${sectionProgress * 100}%`;
    }
    
    const featuredContents = document.querySelectorAll('.featured-content');
    featuredContents.forEach((content, i) => {
      if (i !== newSection && i !== previousSection) {
        content.classList.remove('active');
        gsap.set(content, { visibility: 'hidden', opacity: 0 });
      }
    });
    
    if (previousSection !== null) {
      const prevWords = this.splitTexts[`featured-${previousSection}`]?.words;
      if (prevWords) {
        gsap.to(prevWords, {
          yPercent: isScrollingDown ? -100 : 100,
          opacity: 0,
          duration: duration * 0.6,
          stagger: isScrollingDown ? 0.03 : -0.03,
          ease: 'customEase',
          onComplete: () => {
            featuredContents[previousSection].classList.remove('active');
            gsap.set(featuredContents[previousSection], { visibility: 'hidden' });
          }
        });
      }
    }
    
    const newWords = this.splitTexts[`featured-${newSection}`]?.words;
    if (newWords) {
      this.soundManager.play('textChange', 250);
      
      featuredContents[newSection].classList.add('active');
      gsap.set(featuredContents[newSection], { visibility: 'visible', opacity: 1 });
      gsap.set(newWords, { yPercent: isScrollingDown ? 100 : -100, opacity: 0 });
      gsap.to(newWords, {
        yPercent: 0,
        opacity: 1,
        duration: duration,
        stagger: isScrollingDown ? 0.05 : -0.05,
        ease: 'customEase'
      });
    }
    
    this.videoElements.forEach((video, i) => {
      if (i === newSection) {
        video.play().catch(() => {});
      } else if (i === previousSection) {
        setTimeout(() => {
          video.pause();
        }, duration * 1000);
      } else {
        video.pause();
      }
    });
    
    const videos = document.querySelectorAll('.background-video');
    videos.forEach((vid: any, i) => {
      vid.classList.remove('previous', 'active');
      if (i === newSection) {
        if (isScrollingDown) {
          gsap.set(vid, { opacity: 1, y: 0, clipPath: 'inset(100% 0 0 0)' });
          gsap.to(vid, { clipPath: 'inset(0% 0 0 0)', duration: duration, ease: 'customEase' });
        } else {
          gsap.set(vid, { opacity: 1, y: 0, clipPath: 'inset(0 0 100% 0)' });
          gsap.to(vid, { clipPath: 'inset(0 0 0% 0)', duration: duration, ease: 'customEase' });
        }
        vid.classList.add('active');
      } else if (i === previousSection) {
        vid.classList.add('previous');
        gsap.to(vid, {
          y: isScrollingDown ? `${parallaxAmount}%` : `-${parallaxAmount}%`,
          duration: duration,
          ease: 'customEase'
        });
        gsap.to(vid, {
          opacity: 0,
          delay: duration * 0.5,
          duration: duration * 0.5,
          ease: 'customEase',
          onComplete: () => {
            vid.classList.remove('previous');
            gsap.set(vid, { y: 0 });
            this.isAnimating = false;
          }
        });
      } else {
        gsap.to(vid, { opacity: 0, duration: duration * 0.3, ease: 'customEase' });
      }
    });
    
    const services = document.querySelectorAll('.service');
    services.forEach((service, i) => {
      if (i === newSection) {
        service.classList.add('active');
        gsap.to(service, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      } else {
        service.classList.remove('active');
        gsap.to(service, { opacity: 0.3, duration: 0.3, ease: 'power2.out' });
      }
    });
    
    const categories = document.querySelectorAll('.category');
    categories.forEach((category, i) => {
      if (i === newSection) {
        category.classList.add('active');
        gsap.to(category, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      } else {
        category.classList.remove('active');
        gsap.to(category, { opacity: 0.3, duration: 0.3, ease: 'power2.out' });
      }
    });
  }

  private updateProgressNumbers(): void {
    const currentSectionDisplay = document.getElementById('current-section');
    if (currentSectionDisplay) {
      currentSectionDisplay.textContent = (this.currentSection + 1).toString().padStart(2, '0');
    }
  }

  // Navigation Methods
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.soundManager.enableAudio();
    this.soundManager.play('click');
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  scrollToTop(): void {
    if (this.lenis) {
      this.lenis.scrollTo(0, { duration: 1.5 });
    }
    this.closeMenu();
  }

  scrollToServices(): void {
    if (this.lenis) {
      const element = document.getElementById('services-section');
      if (element) {
        this.lenis.scrollTo(element, { duration: 1.5, offset: -100 });
      }
    }
    this.closeMenu();
  }

  scrollToShowcase(): void {
    if (this.lenis) {
      const element = document.getElementById('showcase-section');
      if (element) {
        this.lenis.scrollTo(element, { duration: 1.5, offset: -100 });
      }
    }
    this.closeMenu();
  }

  scrollToAbout(): void {
    if (this.lenis) {
      const element = document.getElementById('about-section');
      if (element) {
        this.lenis.scrollTo(element, { duration: 1.5, offset: -100 });
      }
    }
    this.closeMenu();
  }

  scrollToContact(): void {
    if (this.lenis) {
      const element = document.getElementById('contact-section');
      if (element) {
        this.lenis.scrollTo(element, { duration: 1.5, offset: -100 });
      }
    }
    this.closeMenu();
  }

  // Testimonial Methods
  nextTestimonial(): void {
    if (this.currentTestimonial < this.testimonials.length - 1) {
      this.currentTestimonial++;
    } else {
      this.currentTestimonial = 0;
    }
    this.updateTestimonialOffset();
    this.soundManager.play('click');
  }

  previousTestimonial(): void {
    if (this.currentTestimonial > 0) {
      this.currentTestimonial--;
    } else {
      this.currentTestimonial = this.testimonials.length - 1;
    }
    this.updateTestimonialOffset();
    this.soundManager.play('click');
  }

  goToTestimonial(index: number): void {
    this.currentTestimonial = index;
    this.updateTestimonialOffset();
    this.soundManager.play('click');
  }

  private updateTestimonialOffset(): void {
    this.testimonialOffset = -this.currentTestimonial * 100;
  }

  // Form Methods
  submitForm(event: Event): void {
    event.preventDefault();
    this.soundManager.play('click');
    
    // Add your form submission logic here
    console.log('Form submitted');
    
    // Show success message (you can add a toast notification)
    alert('Thank you for your message! We\'ll get back to you soon.');
  }
}
