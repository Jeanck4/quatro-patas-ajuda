
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EditPetDialog } from '@/components/EditPetDialog';
import * as api from '@/services/api';
import { Dog, Building, ListPlus, Settings, Calendar, LogOut, Trash, Pencil } from 'lucide-react';
