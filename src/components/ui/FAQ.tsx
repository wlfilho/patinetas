'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FAQItem, faqSection } from '@/types/faq'
import { FAQStructuredData } from '@/components/seo/FAQStructuredData'

interface FAQProps {
  className?: string
}

interface FAQItemComponentProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FAQItemComponent({ item, isOpen, onToggle, index }: FAQItemComponentProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className={`
          w-full px-6 py-4 text-left flex items-center justify-between
          hover:bg-gray-50 transition-colors duration-200 focus:outline-none
          focus:ring-2 focus:ring-primary focus:ring-inset
          ${isOpen ? 'bg-gray-50' : 'bg-white'}
        `}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
        tabIndex={0}
      >
        <h3 className="text-lg font-medium text-gray-900 pr-4 flex-1">
          {item.question}
        </h3>
        <div className={`
          flex-shrink-0 w-6 h-6 flex items-center justify-center
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'transform rotate-180' : ''}
        `}>
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        id={`faq-answer-${item.id}`}
        aria-labelledby={`faq-question-${item.id}`}
        role="region"
      >
        <div className="px-6 pb-4 pt-2">
          <p className="text-gray-700 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ({ className = '' }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId)
    } else {
      newOpenItems.add(itemId)
    }
    setOpenItems(newOpenItems)
  }

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleItem(itemId)
    }
  }

  return (
    <>
      <FAQStructuredData faqItems={faqSection.items} />
      
      <section className={`py-16 sm:py-24 bg-white ${className}`}>
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              {faqSection.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {faqSection.description}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4" role="list" aria-label="Lista de preguntas frecuentes">
            {faqSection.items.map((item, index) => (
              <div key={item.id} role="listitem">
                <FAQItemComponent
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              ¿No encontraste la respuesta que buscabas?
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Contáctanos
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
