"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Server, 
  Play, 
  Square, 
  Upload, 
  Calendar,
  Activity,
  Users,
  Clock,
  Eye,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';

export default function MemberDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [streams, setStreams] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    checkMemberAuth();
  }, []);

  const checkMemberAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user.status === 'active') {
          loadMemberData();
        } else {
          window.location.href = '/';
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Member auth check error:', error);
      window.location.href = '/login';
    }
  };

  const loadMemberData = async () => {
    try {
      const response = await fetch('/api/member/dashboard', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setServers(data.servers);
        setStats(data.stats);
        loadStreams();
      }
    } catch (error) {
      console.error('Load member data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStreams = async () => {
    try {
      const response = await fetch('/api/member/streams', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStreams(data.streams);
      }
    } catch (error) {
      console.error('Load streams error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      ready: 'bg-green-100 text-green-800',
      provisioning: 'bg-blue-100 text-blue-800',
      installing: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      live: 'bg-green-100 text-green-800',
      stopped: 'bg-gray-100 text-gray-800',
      starting: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.floor(hours * 60)}m`;
    return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                StreamHib Member Area
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.fullName}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {user?.subscription} Plan
              </Badge>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'servers', label: 'My Servers', icon: Server },
                { id: 'streams', label: 'Live Streams', icon: Play },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStreams || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.liveStreams || 0} currently live
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViewers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All time viewers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Live Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDuration || 0}h</div>
                  <p className="text-xs text-muted-foreground">
                    Total streaming time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Servers</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active servers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Create New Stream
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 mb-2" />
                    Upload Video
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Calendar className="w-6 h-6 mb-2" />
                    Schedule Stream
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Streams */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streams.slice(0, 5).map((stream) => (
                    <div key={stream.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          stream.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">{stream.streamTitle}</p>
                          <p className="text-sm text-gray-500">
                            {stream.platform} • {stream.quality}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(stream.status)}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Servers Tab */}
        {activeTab === 'servers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Servers</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {servers.map((server) => (
                <Card key={server.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{server.serverName}</CardTitle>
                      {getStatusBadge(server.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">IP Address</p>
                        <p className="font-medium">{server.ipAddress || 'Provisioning...'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Package</p>
                        <p className="font-medium">{server.packageType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Server Type</p>
                        <p className="font-medium">{server.serverType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expires</p>
                        <p className="font-medium">
                          {server.expiryDate ? new Date(server.expiryDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {server.status === 'ready' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Dashboard Access</span>
                          <Button size="sm" variant="outline" asChild>
                            <a href={server.dashboardUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open Dashboard
                            </a>
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Username: {server.dashboardUsername} | Password: {server.dashboardPassword}
                        </div>
                      </div>
                    )}

                    {server.status === 'provisioning' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          🚀 Server is being provisioned. This usually takes 5-10 minutes.
                        </p>
                      </div>
                    )}

                    {server.status === 'installing' && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          ⚙️ Installing streaming software. Almost ready!
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        Active Streams: {server.LiveStreams?.length || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {servers.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No servers found</p>
                  <p className="text-sm text-gray-400">
                    Your server will appear here after payment is processed
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Streams Tab */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Live Streams</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Stream
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {streams.map((stream) => (
                <Card key={stream.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stream.streamTitle}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(stream.status)}
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Platform</p>
                        <p className="font-medium capitalize">{stream.platform}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quality</p>
                        <p className="font-medium">{stream.quality}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Viewers</p>
                        <p className="font-medium">{stream.totalViewers || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">{formatDuration(stream.liveDuration / 3600 || 0)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {stream.status === 'stopped' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <Play className="w-4 h-4 mr-2" />
                          Start Stream
                        </Button>
                      )}
                      {stream.status === 'live' && (
                        <Button size="sm" variant="destructive">
                          <Square className="w-4 h-4 mr-2" />
                          Stop Stream
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {streams.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No streams created yet</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Stream
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={user?.fullName || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="subscription">Current Plan</Label>
                    <Input id="subscription" value={user?.subscription || 'No plan'} readOnly />
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    {getStatusBadge(user?.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Plan</span>
                    <span className="font-medium">{user?.subscription || 'No plan'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expires</span>
                    <span className="font-medium">
                      {user?.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <Button className="w-full">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}