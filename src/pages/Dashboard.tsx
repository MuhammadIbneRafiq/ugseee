import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Video, 
  Plus, 
  Sparkles, 
  Download, 
  Share2, 
  Eye,
  CreditCard,
  LogOut,
  User,
  Settings,
  Upload,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NavBar } from '@/components/NavBar';

interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  duration: string;
  script: string;
}

const Dashboard = () => {
  const { user, logout, consumeCredit } = useAuth();
  const { toast } = useToast();

  // Video creation form state
  const [script, setScript] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [aspectRatio, setAspectRatio] = useState('vertical');
  const [isGenerating, setIsGenerating] = useState(false);

  // Dummy video projects
  const [projects] = useState<VideoProject[]>([
    {
      id: '1',
      title: 'AI Product Demo',
      thumbnail: '/placeholder.svg',
      status: 'completed',
      createdAt: '2 hours ago',
      duration: '0:30',
      script: 'Introducing our revolutionary AI-powered solution...'
    },
    {
      id: '2',
      title: 'Brand Introduction',
      thumbnail: '/placeholder.svg',
      status: 'generating',
      createdAt: '5 minutes ago',
      duration: '0:45',
      script: 'Welcome to the future of content creation...'
    }
  ]);

  const handleGenerateVideo = async () => {
    if (!script.trim()) {
      toast({
        title: "Script required",
        description: "Please enter a script for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!consumeCredit()) {
      toast({
        title: "No credits remaining",
        description: "Please purchase more credits to generate videos.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Video generation started!",
        description: "Your video is being generated. This may take a few minutes.",
      });
      // Reset form
      setScript('');
      setSelectedImages([]);
      setSelectedAudio('');
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Welcome back, {user?.firstName || 'Creator'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Create amazing AI-powered videos in minutes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              {user?.credits || 0} Credits
            </Badge>
            <Button asChild className="btn-premium">
              <Link to="/pricing">
                <CreditCard className="h-4 w-4 mr-2" />
                Get More Credits
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-secondary">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Video
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              My Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create New Video
                </CardTitle>
                <CardDescription>
                  Transform your script into engaging videos with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="script">Video Script *</Label>
                  <Textarea
                    id="script"
                    placeholder="Enter your video script here... The AI will transform this into a compelling video."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={6}
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="images">Reference Images (Optional)</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="images" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upload images to guide the AI
                        </p>
                        {selectedImages.length > 0 && (
                          <p className="text-xs text-primary mt-2">
                            {selectedImages.length} image(s) selected
                          </p>
                        )}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="audio">Audio Style</Label>
                      <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Choose audio style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upbeat">Upbeat & Energetic</SelectItem>
                          <SelectItem value="calm">Calm & Professional</SelectItem>
                          <SelectItem value="dramatic">Dramatic & Cinematic</SelectItem>
                          <SelectItem value="minimal">Minimal & Clean</SelectItem>
                          <SelectItem value="none">No Background Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aspect">Aspect Ratio</Label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vertical">Vertical (9:16) - Social Media</SelectItem>
                          <SelectItem value="square">Square (1:1) - Instagram</SelectItem>
                          <SelectItem value="horizontal">Horizontal (16:9) - YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !script.trim()}
                  className="btn-hero w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Video (1 Credit)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="card-glow">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      {project.status === 'completed' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      )}
                      {project.status === 'generating' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Sparkles className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className={project.status === 'generating' ? 'animate-pulse' : ''}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{project.createdAt}</span>
                      <span>{project.duration}</span>
                    </div>
                  </CardHeader>
                  {project.status === 'completed' && (
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);
};

export default Dashboard;