
import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { User, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, Trash, UserCog } from 'lucide-react';
import StarRating from './StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserListProps {
  showRoleFilter?: boolean;
  onViewUserDetails?: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({
  showRoleFilter = true,
  onViewUserDetails,
}) => {
  const { users, deleteUser } = useData();
  
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<'name' | 'email' | 'address' | 'role'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: 'name' | 'email' | 'address' | 'role') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => 
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        user.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
        (filterRole === 'ALL' || user.role === filterRole)
      )
      .sort((a, b) => {
        const compareValue = (fieldA: string, fieldB: string) => {
          return sortDirection === 'asc' 
            ? fieldA.localeCompare(fieldB) 
            : fieldB.localeCompare(fieldA);
        };
        
        return compareValue(a[sortField], b[sortField]);
      });
  }, [users, searchName, searchEmail, searchAddress, filterRole, sortField, sortDirection]);

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {showRoleFilter && (
            <div className="min-w-[200px]">
              <Select 
                value={filterRole} 
                onValueChange={(value) => setFilterRole(value as UserRole | 'ALL')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrators</SelectItem>
                  <SelectItem value={UserRole.USER}>Normal Users</SelectItem>
                  <SelectItem value={UserRole.STORE_OWNER}>Store Owners</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 px-2"
                  >
                    Name 
                    <ArrowUpDown size={16} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort('email')}
                    className="flex items-center gap-1 px-2"
                  >
                    Email
                    <ArrowUpDown size={16} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort('address')}
                    className="flex items-center gap-1 px-2"
                  >
                    Address
                    <ArrowUpDown size={16} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort('role')}
                    className="flex items-center gap-1 px-2"
                  >
                    Role
                    <ArrowUpDown size={16} />
                  </Button>
                </TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={user.address}>
                      {user.address}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        user.role === UserRole.ADMIN 
                          ? 'bg-blue-50 text-blue-700' 
                          : user.role === UserRole.STORE_OWNER
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onViewUserDetails && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onViewUserDetails(user)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Confirm Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    className="h-24 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
