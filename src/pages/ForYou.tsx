import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Heart, 
  Share2, 
  Bookmark, 
  Search,
  Filter,
  TrendingUp,
  Clock
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';

interface PublicVideo {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  duration: string;
  views: number;
  likes: number;
  category: string;
  createdAt: string;
  description: string;
}

const ForYou = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dummy public videos
  const publicVideos: PublicVideo[] = [
    {
      id: '1',
      title: 'Revolutionary AI Product Launch',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'TechCorp Studios',
        avatar: '/placeholder.svg',
        verified: true
      },
      duration: '1:24',
      views: 15420,
      likes: 892,
      category: 'Business',
      createdAt: '2 days ago',
      description: 'Showcasing the future of AI technology with stunning visuals and compelling storytelling.'
    },
    {
      id: '2',
      title: 'Sustainable Fashion Brand Story',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'EcoStyle Creative',
        avatar: '/placeholder.svg',
        verified: false
      },
      duration: '0:45',
      views: 8340,
      likes: 567,
      category: 'Fashion',
      createdAt: '1 day ago',
      description: 'A beautiful narrative about sustainable fashion and environmental consciousness.'
    },
    {
      id: '3',
      title: 'Fitness App Motivation Video',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'FitLife Media',
        avatar: '/placeholder.svg',
        verified: true
      },
      duration: '0:30',
      views: 22100,
      likes: 1340,
      category: 'Health',
      createdAt: '3 days ago',
      description: 'High-energy motivation video showcasing transformation stories and workout highlights.'
    },
    {
      id: '4',
      title: 'Local Restaurant Success Story',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'Foodie Productions',
        avatar: '/placeholder.svg',
        verified: false
      },
      duration: '1:15',
      views: 5670,
      likes: 234,
      category: 'Food',
      createdAt: '4 days ago',
      description: 'Heartwarming story of a family restaurant that became a local favorite.'
    },
    {
      id: '5',
      title: 'Travel Agency Adventure Showcase',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'Wanderlust Videos',
        avatar: '/placeholder.svg',
        verified: true
      },
      duration: '2:03',
      views: 18900,
      likes: 1120,
      category: 'Travel',
      createdAt: '5 days ago',
      description: 'Breathtaking destinations and adventure experiences from around the world.'
    },
    {
      id: '6',
      title: 'Educational Tech Platform Demo',
      thumbnail: '/placeholder.svg',
      creator: {
        name: 'EduTech Creators',
        avatar: '/placeholder.svg',
        verified: false
      },
      duration: '1:45',
      views: 12500,
      likes: 789,
      category: 'Education',
      createdAt: '1 week ago',
      description: 'Interactive learning platform demonstration with engaging student testimonials.'
    }
  ];

  const categories = ['all', 'Business', 'Fashion', 'Health', 'Food', 'Travel', 'Education'];

  const filteredVideos = publicVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">For You</h1>
          <p className="text-muted-foreground">
            Discover amazing videos created by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-hero" : "btn-ghost"}
              >
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </div>
        )}
      </div>

        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.slice(0, 4).map((video) => (
              <Card key={video.id} className="card-glow hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden group cursor-pointer">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={video.creator.avatar} />
                      <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{video.creator.name}</span>
                    {video.creator.verified && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatViews(video.views)} views</span>
                    <span>{video.createdAt}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Videos */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Latest Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.slice(4).map((video) => (
              <Card key={video.id} className="card-glow hover:scale-105 transition-transform duration-300">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden group cursor-pointer">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={video.creator.avatar} />
                      <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{video.creator.name}</span>
                    {video.creator.verified && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatViews(video.views)} views</span>
                    <span>{video.createdAt}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYou;