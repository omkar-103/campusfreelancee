// components/TestApplicationModal.tsx (temporary test component)
'use client'

import { useState } from 'react'
import ApplicationModal from './ApplicationModal'
import { Button } from './ui/button'

export default function TestApplicationModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>
        Test Application Modal
      </Button>
      
      <ApplicationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId="68c5491de9d0ed5c12a31071"
        projectTitle="Test Project"
        projectBudget={{ min: 100, max: 1000 }}
        userId="Xr9d4929TQRUbnrMlqEtb7e1r8z1"
      />
    </div>
  )
}