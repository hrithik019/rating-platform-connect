
import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { UserRole, Store } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from 'lucide-react';
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

interface StoreListProps {
  onRateStore?: (store: Store) => void;
  showRatingControls?: boolean;
  showAddressSearch?: boolean;
  showNameSearch?: boolean;
}

const StoreList: React.FC<StoreListProps> = ({ 
  onRateStore,
  showRatingControls = true,
  showAddressSearch = true,
  showNameSearch = true,
}) => {
  const { stores, getUserRating, addRating } = useData();
  const { user } = useAuth();
  
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState<'name' | 'address' | 'avgRating'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: 'name' | 'address' | 'avgRating') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredStores = useMemo(() => {
    return stores
      .filter(store => 
        (showNameSearch ? store.name.toLowerCase().includes(searchName.toLowerCase()) : true) &&
        (showAddressSearch ? store.address.toLowerCase().includes(searchAddress.toLowerCase()) : true)
      )
      .sort((a, b) => {
        const compareValue = (fieldA: string | number, fieldB: string | number) => {
          if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return sortDirection === 'asc' 
              ? fieldA.localeCompare(fieldB) 
              : fieldB.localeCompare(fieldA);
          } else {
            return sortDirection === 'asc' 
              ? (fieldA as number) - (fieldB as number) 
              : (fieldB as number) - (fieldA as number);
          }
        };
        
        return compareValue(a[sortField], b[sortField]);
      });
  }, [stores, searchName, searchAddress, sortField, sortDirection, showNameSearch, showAddressSearch]);

  const handleRate = (storeId: string, rating: number) => {
    if (user) {
      addRating(storeId, user.id, rating);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stores</CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          {showNameSearch && (
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
          )}
          
          {showAddressSearch && (
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
                    onClick={() => toggleSort('avgRating')}
                    className="flex items-center gap-1 px-2"
                  >
                    Rating
                    <ArrowUpDown size={16} />
                  </Button>
                </TableHead>
                {showRatingControls && user?.role === UserRole.USER && (
                  <TableHead>Your Rating</TableHead>
                )}
                {onRateStore && (
                  <TableHead className="w-24 text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => {
                  const userRating = user ? getUserRating(store.id, user.id) : undefined;
                  
                  return (
                    <TableRow key={store.id}>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StarRating rating={store.avgRating} />
                          <span>({store.avgRating.toFixed(1)})</span>
                        </div>
                      </TableCell>
                      {showRatingControls && user?.role === UserRole.USER && (
                        <TableCell>
                          <StarRating 
                            rating={userRating?.value || 0}
                            interactive={true}
                            onChange={(rating) => handleRate(store.id, rating)}
                          />
                        </TableCell>
                      )}
                      {onRateStore && (
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onRateStore(store)}
                          >
                            Rate
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={showRatingControls && user?.role === UserRole.USER ? 5 : 4} 
                    className="h-24 text-center"
                  >
                    No stores found.
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

export default StoreList;
