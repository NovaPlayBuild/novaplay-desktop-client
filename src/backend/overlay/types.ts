import { ToastKey } from '@novaplay/utils'
import { TransactionToastProps } from '@novaplay/ui'

export interface Toast extends TransactionToastProps {
  isOpen: boolean
  key: ToastKey
}
