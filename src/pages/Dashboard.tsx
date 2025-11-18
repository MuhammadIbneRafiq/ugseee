import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';

interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  duration: string;
  script: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const Dashboard = () => {
  const { user, consumeCredit } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'projects' | 'create' | 'script'>('projects');
  // Video creation form state
  const [script, setScript] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [settingDescription, setSettingDescription] = useState('');
  const [otherRequests, setOtherRequests] = useState('');
  const [durationOption, setDurationOption] = useState('16');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [imageModel, setImageModel] = useState<'nano' | 'seadream'>('nano');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Script generator state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);

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

    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in before generating a video.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    const { error } = await supabase.from('videos').insert({
      user_id: user.id,
      title: 'Untitled video',
      script: script.trim(),
      character_description: characterDescription || null,
      setting_description: settingDescription || null,
      other_requests: otherRequests || null,
      duration_option: Number(durationOption),
      aspect_ratio: aspectRatio,
      image_model: imageModel,
      status: 'processing',
    });

    if (error) {
      console.error('Error inserting video:', error);
      toast({
        title: "Could not start video generation",
        description: "There was an error saving your video request.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Video generation started!",
        description: "Your video is being generated. This may take a few minutes.",
      });
      // Reset form
      setScript('');
      setCharacterDescription('');
      setSettingDescription('');
      setOtherRequests('');
      setDurationOption('16');
      setAspectRatio('9:16');
      setImageModel('nano');
      setSelectedImages([]);
      setSelectedAudio('');
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleScriptGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatGenerating(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Mock script idea based on your prompt:\n\n${trimmed}\n\n(This is a placeholder response – wire up your real API here.)`,
      };
      setChatMessages((prev) => [...prev, reply]);
      setIsChatGenerating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <NavBar />

      <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset" className="!top-16">
          <SidebarHeader>
            <div className="px-2 pt-1.5 pb-1 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              Workspace
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={view !== 'script'}
                      onClick={() => setView('projects')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      <span>My Videos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={view === 'script'}
                      onClick={() => setView('script')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>Script Generator</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hidden md:inline-flex" />
                <div>
                  <h1 className="text-3xl font-bold text-gradient">
                    Welcome back, {user?.firstName || 'Creator'}!
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Create amazing AI-powered videos in minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
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

            {/* Main content */}
            <div className="flex-1">
              {view === 'script' ? (
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Script Generator
                    </CardTitle>
                    <CardDescription>
                      Chat-style interface to brainstorm video scripts. Responses are mocked for now.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex-1 min-h-[260px] max-h-[420px] overflow-y-auto space-y-3 rounded-lg bg-background/60 p-4 border border-border/60">
                      {chatMessages.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Start by describing the video you want to create, and Ill suggest a script outline.
                        </p>
                      )}
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleScriptGenerate} className="flex flex-col sm:flex-row gap-3">
                      <Textarea
                        rows={2}
                        placeholder="Describe your video idea or ask for a script..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="bg-background/70 flex-1"
                      />
                      <Button
                        type="submit"
                        className="btn-hero sm:w-40 flex-shrink-0"
                        disabled={isChatGenerating || !chatInput.trim()}
                      >
                        {isChatGenerating ? 'Generating...' : 'Generate'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : view === 'create' ? (
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="mb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setView('projects')}
                        className="px-0 text-muted-foreground"
                      >
                        Back to My Videos
                      </Button>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Create New Video
                    </CardTitle>
                    <CardDescription>
                      Describe your video so UGSEE can generate the best result.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="character">Character description (optional)</Label>
                          <Textarea
                            id="character"
                            placeholder="Who is in the video? Leave empty to let AI decide."
                            value={characterDescription}
                            onChange={(e) => setCharacterDescription(e.target.value)}
                            rows={3}
                            className="bg-background/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="setting">Setting description (optional)</Label>
                          <Textarea
                            id="setting"
                            placeholder="Where does this video take place? Leave empty to let AI decide."
                            value={settingDescription}
                            onChange={(e) => setSettingDescription(e.target.value)}
                            rows={3}
                            className="bg-background/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="script">Script description *</Label>
                          <Textarea
                            id="script"
                            placeholder="Describe what should be said or shown in the video."
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            rows={4}
                            className="bg-background/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="other">Other requests (optional)</Label>
                          <Textarea
                            id="other"
                            placeholder="Anything else? Call-to-actions, pacing, style notes..."
                            value={otherRequests}
                            onChange={(e) => setOtherRequests(e.target.value)}
                            rows={4}
                            className="bg-background/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Select value={durationOption} onValueChange={setDurationOption}>
                              <SelectTrigger id="duration" className="bg-background/50">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="8">8 seconds</SelectItem>
                                <SelectItem value="16">16 seconds</SelectItem>
                                <SelectItem value="24">24 seconds</SelectItem>
                                <SelectItem value="32">32 seconds</SelectItem>
                                <SelectItem value="40">40 seconds</SelectItem>
                                <SelectItem value="48">48 seconds</SelectItem>
                                <SelectItem value="58">58 seconds</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="aspect">Aspect ratio</Label>
                            <Select value={aspectRatio} onValueChange={setAspectRatio}>
                              <SelectTrigger id="aspect" className="bg-background/50">
                                <SelectValue placeholder="Select aspect ratio" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                <SelectItem value="16:9">16:9 (Horizontal)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="image-model">TikTok image model</Label>
                            <Select value={imageModel} onValueChange={(v) => setImageModel(v as 'nano' | 'seadream')}>
                              <SelectTrigger id="image-model" className="bg-background/50">
                                <SelectValue placeholder="Select image model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nano">Nano</SelectItem>
                                <SelectItem value="seadream">TikTok image model</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="audio">Audio Style (optional)</Label>
                            <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                              <SelectTrigger id="audio" className="bg-background/50">
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="images">Reference images (optional)</Label>
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card
                    className="card-glow flex flex-col items-center justify-center cursor-pointer border-dashed border-2 border-primary/40 hover:bg-primary/5 transition-colors"
                    onClick={() => setView('create')}
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg mb-1">Create New Video</CardTitle>
                      <CardDescription>
                        Start a new AI-powered video project
                      </CardDescription>
                    </div>
                  </Card>
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
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;