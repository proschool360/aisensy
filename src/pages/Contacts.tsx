import React, { useState } from 'react';
import { useApi, useMutation } from '../hooks/useApi';
import { contactsAPI } from '../lib/api';
import Header from '../components/Layout/Header';
import ContactsTable from '../components/Contacts/ContactsTable';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Contacts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: contactsData, loading, refetch } = useApi(() => 
    contactsAPI.getContacts({ page, search, limit: 20 })
  );
  
  const { mutate: createContact, loading: creating } = useMutation(contactsAPI.createContact);
  const { mutate: deleteContact } = useMutation(contactsAPI.deleteContact);

  const handleContactSelect = (contact: any) => {
    console.log('Selected contact:', contact);
  };

  const handleCreateContact = async (data: any) => {
    try {
      await createContact(data);
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(contactId);
        refetch();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Contacts" subtitle="Loading..." />
        <div className="p-6">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl h-96 border border-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Contacts" 
        subtitle="Manage your WhatsApp contacts and segments" 
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              onClick={() => setShowCreateModal(true)}
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Contact
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {contactsData?.pagination?.total || 0} contacts
            </span>
          </div>
        </div>
        
        <ContactsTable 
          contacts={contactsData?.contacts || []} 
          onContactSelect={handleContactSelect}
          onContactDelete={handleDeleteContact}
        />
        
        {/* TODO: Add CreateContactModal component */}
      </div>
    </div>
  );
};

export default Contacts;