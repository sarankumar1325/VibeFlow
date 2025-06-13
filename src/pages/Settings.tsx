import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TextHoverEffect from '@/components/TextHoverEffect';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Project Manager',
    bio: 'Experienced project manager passionate about streamlining workflows and maximizing team productivity.',
    
    // Preferences
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-8',
    dateFormat: 'MM/DD/YYYY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    weeklyReports: false,
    
    // Privacy & Security
    profileVisibility: 'team',
    activityTracking: true,
    dataSharing: false,
    twoFactorAuth: false,
    
    // API Settings
    geminiApiKey: '',
    autoSave: true,
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-vibeflow-dark relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-48 -left-48 opacity-30"></div>
        <div className="floating-orb w-80 h-80 -bottom-40 -right-40 opacity-20"></div>
        <div className="floating-orb w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="glass-effect border-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-vibeflow-gradient rounded-xl flex items-center justify-center glow-effect">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    <TextHoverEffect text="Settings" />
                  </h1>
                  <p className="text-sm text-white/60">Customize your VibeFlow experience</p>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-vibeflow-gradient hover:opacity-90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass-effect grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="data-[state=active]:bg-vibeflow-gradient">
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-vibeflow-gradient">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-vibeflow-gradient">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-vibeflow-gradient">
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-vibeflow-gradient">
              API & Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-vibeflow-blue" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-vibeflow-gradient rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {settings.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input 
                          id="name"
                          value={settings.name}
                          onChange={(e) => handleSettingChange('name', e.target.value)}
                          className="glass-effect border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleSettingChange('email', e.target.value)}
                          className="glass-effect border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-white">Role</Label>
                      <Select value={settings.role} onValueChange={(value) => handleSettingChange('role', value)}>
                        <SelectTrigger className="glass-effect border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Project Manager">Project Manager</SelectItem>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="Designer">Designer</SelectItem>
                          <SelectItem value="Analyst">Analyst</SelectItem>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    className="glass-effect border-white/20 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-vibeflow-violet" />
                  Display & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map((theme) => (
                      <div 
                        key={theme.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-vibeflow-violet/50 ${
                          settings.theme === theme.value 
                            ? 'border-vibeflow-violet bg-vibeflow-violet/10' 
                            : 'border-white/20 bg-black/20'
                        }`}
                        onClick={() => handleSettingChange('theme', theme.value)}
                      >
                        <div className="flex items-center gap-3">
                          <theme.icon className="w-5 h-5 text-white" />
                          <span className="text-white font-medium">{theme.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="language" className="text-white">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger className="glass-effect border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-white">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger className="glass-effect border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat" className="text-white">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                      <SelectTrigger className="glass-effect border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-vibeflow-emerald" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser and mobile push notifications' },
                  { key: 'taskReminders', label: 'Task Reminders', description: 'Reminders for upcoming task deadlines' },
                  { key: 'projectUpdates', label: 'Project Updates', description: 'Notifications about project status changes' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly productivity and progress reports' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">{setting.label}</h3>
                      <p className="text-sm text-white/60">{setting.description}</p>
                    </div>
                    <Switch 
                      checked={settings[setting.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Profile Visibility</h3>
                      <p className="text-sm text-white/60">Who can see your profile information</p>
                    </div>
                    <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                      <SelectTrigger className="w-40 glass-effect border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="team">Team Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Activity Tracking</h3>
                      <p className="text-sm text-white/60">Allow tracking of your activity for analytics</p>
                    </div>
                    <Switch 
                      checked={settings.activityTracking}
                      onCheckedChange={(checked) => handleSettingChange('activityTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Data Sharing</h3>
                      <p className="text-sm text-white/60">Share anonymized data to improve the platform</p>
                    </div>
                    <Switch 
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-white/60">Add an extra layer of security to your account</p>
                      {settings.twoFactorAuth && (
                        <Badge className="mt-2 bg-vibeflow-emerald text-white">Enabled</Badge>
                      )}
                    </div>
                    <Switch 
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <Button variant="outline" className="w-full glass-effect border-white/20 text-white">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full glass-effect border-red-500/20 text-red-400 hover:bg-red-500/10">
                    Download Account Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-vibeflow-blue" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="geminiApiKey" className="text-white">Google Gemini API Key</Label>
                  <Input 
                    id="geminiApiKey"
                    type="password"
                    value={settings.geminiApiKey}
                    onChange={(e) => handleSettingChange('geminiApiKey', e.target.value)}
                    placeholder="Enter your Google Gemini API key"
                    className="glass-effect border-white/20 text-white"
                  />
                  <p className="text-sm text-white/60 mt-2">
                    Required for AI-powered document processing and task generation
                  </p>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Auto-Save</h3>
                      <p className="text-sm text-white/60">Automatically save your work</p>
                    </div>
                    <Switch 
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">Backup Frequency</h3>
                      <p className="text-sm text-white/60">How often to backup your data</p>
                    </div>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                      <SelectTrigger className="w-40 glass-effect border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <Button variant="outline" className="w-full glass-effect border-white/20 text-white">
                    Export Settings
                  </Button>
                  <Button variant="outline" className="w-full glass-effect border-white/20 text-white">
                    Import Settings
                  </Button>
                  <Button variant="outline" className="w-full glass-effect border-red-500/20 text-red-400 hover:bg-red-500/10">
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
