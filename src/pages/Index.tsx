import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Sparkles, 
  Users, 
  Zap, 
  Play, 
  ArrowRight,
  CheckCircle,
  Star,
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import heroImage from '@/assets/hero-image.jpg';
import featureCreation from '@/assets/feature-creation.jpg';
import featureSharing from '@/assets/feature-sharing.jpg';

const Index = () => {
  const features = [
    {
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      title: "AI-Powered Generation",
      description: "Transform your scripts into stunning videos using advanced AI technology. No editing skills required.",
      image: featureCreation
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Community Sharing",
      description: "Share your creations with the world and discover amazing content from other creators.",
      image: featureSharing
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Lightning Fast",
      description: "Generate professional-quality videos in minutes, not hours. Perfect for social media and marketing."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp",
      content: "UGSEE has transformed our content creation process. We're now producing 5x more videos with half the effort.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Content Creator",
      company: "Independent",
      content: "The quality of AI-generated videos is incredible. My followers can't tell the difference from professionally shot content.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Lead",
      company: "Growth Co",
      content: "Perfect for our social media campaigns. The variety of styles and formats keeps our content fresh and engaging.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Video Generation
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Create Stunning{' '}
                <span className="text-gradient">AI Videos</span>{' '}
                in Minutes
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your scripts into professional videos using cutting-edge AI technology. 
                Perfect for marketing, social media, and content creation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild className="btn-hero">
                  <Link to="/signup">
                    Get started!
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-ghost">
                  <Link to="/signin">
                    <Play className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>5 free credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="animate-slide-up">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="AI Video Generation Platform" 
                  className="rounded-2xl shadow-card w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for{' '}
              <span className="text-gradient">Every Creator</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, share, and manage your AI-generated video content
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-glow hover:scale-105 transition-all duration-300">
                <CardHeader>
                  {feature.image && (
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Create professional videos in just 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Write Your Script",
                description: "Simply paste your video script or let our AI help you write one"
              },
              {
                step: "02", 
                title: "Customize & Generate",
                description: "Choose your style, add images, select audio, and click generate"
              },
              {
                step: "03",
                title: "Share & Download",
                description: "Your video is ready! Share it or download in your preferred format"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by <span className="text-gradient">Creators</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community has to say about UGSEE
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of creators who are already using UGSEE to transform their content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/signup">
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-gradient">UGSEE</span>
              </div>
              <p className="text-muted-foreground">
                Create stunning AI-powered videos in minutes, not hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/for-you" className="hover:text-primary transition-colors">Examples</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 UGSEE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
