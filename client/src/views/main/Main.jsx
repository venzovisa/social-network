import { Box } from '@mui/material';

const Main = ({ render: Component, style }) => {
  return (
    <Box sx={{
      flex: { xl: '1 0 0', lg: '2 0 0', md: '3 0 0', xs: '10 0 0' },
      ...style
    }} >
      <Component />
    </Box>
  )
}

export default Main;