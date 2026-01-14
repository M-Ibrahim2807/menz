// Utility helper functions

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export const truncateText = (text, length) => {
  return text?.length > length ? text.substring(0, length) + '...' : text
}

export const handleError = (error) => {
  console.error('Error:', error)
  return error?.message || 'An unexpected error occurred'
}
