'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Fingerprint, 
  User, 
  Shield, 
  Calendar, 
  Hash,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import type { ParsedKeyData } from '@/types/pgp';

interface KeyAnalysisProps {
  keyData: ParsedKeyData;
}

export function KeyAnalysis({ keyData }: KeyAnalysisProps) {
  const formatFingerprint = (fingerprint: string) => {
    return fingerprint.match(/.{1,4}/g)?.join(' ') || fingerprint;
  };

  const formatKeyId = (keyId: string) => {
    return keyId.toUpperCase();
  };

  const getAlgorithmBadgeColor = (algorithm: string) => {
    switch (algorithm.toLowerCase()) {
      case 'rsa':
        return 'bg-blue-100 text-blue-800';
      case 'ecdsa':
      case 'ecdh':
        return 'bg-green-100 text-green-800';
      case 'eddsa':
        return 'bg-purple-100 text-purple-800';
      case 'dsa':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageBadgeColor = (usage: string) => {
    switch (usage.toLowerCase()) {
      case 'sign':
        return 'bg-emerald-100 text-emerald-800';
      case 'encrypt':
        return 'bg-blue-100 text-blue-800';
      case 'certify':
        return 'bg-purple-100 text-purple-800';
      case 'authenticate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Key className="h-6 w-6 text-blue-600" />
            Key Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="identities">Identities</TabsTrigger>
              <TabsTrigger value="subkeys">Subkeys</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Fingerprint className="h-5 w-5 text-purple-600" />
                      Primary Key
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Fingerprint</label>
                      <p className="font-mono text-sm bg-slate-50 p-2 rounded border break-all">
                        {formatFingerprint(keyData.fingerprint)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Key ID</label>
                      <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                        {formatKeyId(keyData.keyId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getAlgorithmBadgeColor(keyData.algorithm)}>
                        {keyData.algorithm}
                      </Badge>
                      <Badge variant="outline">
                        {keyData.bitLength} bits
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Key Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Created</label>
                      <p className="text-sm">{keyData.creationTime}</p>
                    </div>
                    {keyData.expirationTime && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Expires</label>
                        <p className="text-sm">{keyData.expirationTime}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {keyData.isExpired ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : keyData.expirationTime ? (
                        <Clock className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {keyData.isExpired ? 'Expired' : keyData.expirationTime ? 'Valid' : 'No expiration'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Usage Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keyData.usage.map((usage, index) => (
                      <Badge key={index} className={getUsageBadgeColor(usage)}>
                        {usage}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="identities" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-green-600" />
                    User Identities ({keyData.userIds.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keyData.userIds.map((uid, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <p className="font-medium">{uid.name}</p>
                            {uid.email && (
                              <p className="text-sm text-slate-600">{uid.email}</p>
                            )}
                            {uid.comment && (
                              <p className="text-sm text-slate-500 italic">"{uid.comment}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {uid.isPrimary && (
                              <Badge variant="default">Primary</Badge>
                            )}
                            {uid.isRevoked ? (
                              <Badge variant="destructive">Revoked</Badge>
                            ) : (
                              <Badge variant="secondary">Valid</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subkeys" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Key className="h-5 w-5 text-purple-600" />
                    Subkeys ({keyData.subkeys.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {keyData.subkeys.map((subkey, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Subkey {index + 1}</h4>
                            <div className="flex gap-2">
                              <Badge className={getAlgorithmBadgeColor(subkey.algorithm)}>
                                {subkey.algorithm}
                              </Badge>
                              <Badge variant="outline">
                                {subkey.bitLength} bits
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Key ID</label>
                              <p className="font-mono text-sm bg-white p-2 rounded border">
                                {formatKeyId(subkey.keyId)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Fingerprint</label>
                              <p className="font-mono text-xs bg-white p-2 rounded border break-all">
                                {formatFingerprint(subkey.fingerprint)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-600 mb-2 block">Usage</label>
                            <div className="flex flex-wrap gap-2">
                              {subkey.usage.map((usage, usageIndex) => (
                                <Badge key={usageIndex} className={getUsageBadgeColor(usage)}>
                                  {usage}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <label className="font-medium text-slate-600">Created</label>
                              <p>{subkey.creationTime}</p>
                            </div>
                            {subkey.expirationTime && (
                              <div>
                                <label className="font-medium text-slate-600">Expires</label>
                                <p>{subkey.expirationTime}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {subkey.isRevoked ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : subkey.isExpired ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              <span>
                                {subkey.isRevoked ? 'Revoked' : subkey.isExpired ? 'Expired' : 'Valid'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Hash className="h-5 w-5 text-indigo-600" />
                      Cryptographic Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Version</label>
                      <p className="text-sm">{keyData.version}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Algorithm</label>
                      <p className="text-sm">{keyData.algorithm}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Key Length</label>
                      <p className="text-sm">{keyData.bitLength} bits</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Curve (if applicable)</label>
                      <p className="text-sm">{keyData.curve || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lock className="h-5 w-5 text-red-600" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {keyData.isRevoked ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {keyData.isRevoked ? 'Key is revoked' : 'Key is not revoked'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {keyData.isExpired ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {keyData.isExpired ? 'Key is expired' : 'Key is not expired'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Client-side analysis only</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Fingerprint className="h-5 w-5 text-slate-600" />
                    Raw Fingerprint Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Full Fingerprint</label>
                      <p className="font-mono text-xs bg-slate-50 p-3 rounded border break-all">
                        {keyData.fingerprint}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Short Key ID</label>
                      <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                        {keyData.keyId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Long Key ID</label>
                      <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                        {keyData.keyId.slice(-16).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}