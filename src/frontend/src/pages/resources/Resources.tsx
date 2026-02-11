import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Phone, Heart, Users, Sparkles } from 'lucide-react';

const RESOURCES = [
  {
    id: 1,
    category: 'helplines',
    title: 'The Trevor Project',
    description: '24/7 crisis support for LGBTQ+ youth',
    contactLink: 'tel:1-866-488-7386',
  },
  {
    id: 2,
    category: 'helplines',
    title: 'Trans Lifeline',
    description: 'Peer support hotline for transgender people',
    contactLink: 'tel:1-877-565-8860',
  },
  {
    id: 3,
    category: 'therapists',
    title: 'Psychology Today LGBTQ+ Therapists',
    description: 'Find LGBTQ+-affirming therapists in your area',
    contactLink: 'https://www.psychologytoday.com',
  },
  {
    id: 4,
    category: 'selfCare',
    title: 'Mindfulness & Meditation',
    description: 'Free guided meditations for stress and anxiety',
    contactLink: 'https://www.headspace.com',
  },
  {
    id: 5,
    category: 'onlineSupport',
    title: 'LGBTQ+ Reddit Communities',
    description: 'Connect with supportive online communities',
    contactLink: 'https://www.reddit.com/r/lgbt',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All', icon: Sparkles },
  { value: 'helplines', label: 'Helplines', icon: Phone },
  { value: 'therapists', label: 'Therapists', icon: Users },
  { value: 'selfCare', label: 'Self-care', icon: Heart },
  { value: 'onlineSupport', label: 'Online Support', icon: Users },
];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Mental Health Resources</h2>
        <p className="text-sm text-muted-foreground">Support when you need it</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat.value)}
            >
              <Icon className="w-3 h-3 mr-1" />
              {cat.label}
            </Badge>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{resource.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(resource.contactLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
}
