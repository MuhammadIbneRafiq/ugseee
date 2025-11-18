import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  Sparkles, 
  Video, 
  Zap,
  Crown,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NavBar } from '@/components/NavBar';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for trying out our AI video generation',
      credits: 10,
      price: { monthly: 9, yearly: 7 },
      icon: <Video className="h-6 w-6" />,
      features: [
        '10 video generations per month',
        'HD video quality (720p)',
        'Standard processing speed',
        'Basic audio library',
        'Email support',
        'Watermark removal'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Great for content creators and small businesses',
      credits: 50,
      price: { monthly: 29, yearly: 23 },
      icon: <Sparkles className="h-6 w-6" />,
      popular: true,
      features: [
        '50 video generations per month',
        'Full HD video quality (1080p)',
        'Priority processing speed',
        'Premium audio library',
        'Custom branding options',
        'Advanced script optimization',
        'Priority email support',
        'Analytics dashboard'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Ideal for agencies and growing companies',
      credits: 150,
      price: { monthly: 79, yearly: 63 },
      icon: <Zap className="h-6 w-6" />,
      features: [
        '150 video generations per month',
        '4K video quality available',
        'Fastest processing speed',
        'Complete audio library access',
        'White-label solutions',
        'API access',
        'Team collaboration tools',
        'Dedicated account manager',
        'Phone & chat support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      credits: 500,
      price: { monthly: 199, yearly: 159 },
      icon: <Crown className="h-6 w-6" />,
      features: [
        '500+ video generations per month',
        'Unlimited video quality options',
        'Dedicated processing resources',
        'Custom audio integration',
        'Full API access & SDKs',
        'Custom AI model training',
        'On-premise deployment options',
        'SLA guarantees',
        '24/7 premium support'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    toast({
      title: "Plan selected!",
      description: `You've selected the ${plans.find(p => p.id === planId)?.name} plan. Redirecting to checkout...`,
    });
    // In a real app, this would redirect to payment processing
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start creating amazing AI videos today. All plans include our core features with no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isYearly ? 'text-primary' : 'text-muted-foreground'}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={isYearly ? 'text-primary' : 'text-muted-foreground'}>
              Yearly
            </Label>
            <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Free Tier Highlight */}
        <div className="mb-8">
          <Card className="card-glow max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6 text-warning" />
                <CardTitle className="text-2xl">Start Free</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Get 5 free credits when you sign up - no payment required!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="btn-hero">
                <Link to="/signup">
                  Get Started Free
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card key={plan.id} className={`card-glow relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4 text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gradient">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per month {isYearly && '(billed yearly)'}
                  </div>
                  <div className="text-sm text-primary mt-1">
                    {plan.credits} video credits included
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={plan.popular ? "btn-hero w-full" : "btn-ghost w-full"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">What happens if I run out of credits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can upgrade your plan at any time or purchase additional credit packs. Your account remains active and you can manage existing videos.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Do credits roll over?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unused credits roll over for up to 3 months on Pro and Business plans. Starter plan credits expire monthly.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Is there a money-back guarantee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer a 30-day money-back guarantee on all paid plans. Try risk-free and see the results for yourself.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;