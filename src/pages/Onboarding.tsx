import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Video, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateUser({
        firstName,
        lastName,
        organization,
        referralSource,
      });
      
      toast({
        title: "Profile completed!",
        description: "Welcome to UGSEE. You have 5 free credits to get started.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or skip for now.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Video className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient">UGSEE</span>
            </div>
            <CardTitle className="text-3xl">Welcome to UGSEE!</CardTitle>
            <CardDescription className="text-lg">
              Let's get to know you better to personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  placeholder="Your company or organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Select value={referralSource} onValueChange={setReferralSource}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="blog">Blog/Article</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="email">Email Newsletter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2">🎉 Welcome Gift</h3>
                <p className="text-sm text-muted-foreground">
                  Start with 5 free video generation credits. No payment required to get started!
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="btn-hero flex-1" disabled={isLoading}>
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={handleSkip} className="btn-ghost">
                  Skip for now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;