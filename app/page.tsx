'use client'
import QuoteCard from '@/components/QuoteCard';
import React from 'react'
import { useDispatch } from 'react-redux';
import { fetchQuotes } from './store/quoteSlice';
import { AppDispatch } from './store/store';
import GenerateQuoteBTN from '@/components/GenerateQuoteBTN';
import Toast from '@/components/Toast';
function page() {

  return (
    <div className="flex h-full gap-4 justify-center items-center flex-col flex-1 p-4">
      <QuoteCard />
      <GenerateQuoteBTN />
    </div>)
}

export default page
