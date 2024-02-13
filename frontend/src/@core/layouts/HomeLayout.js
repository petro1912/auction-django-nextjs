// ** MUI Imports
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from 'src/hooks/useAuth'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5)
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative'
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.info.main,
  fontSize: "18px"
}))

const HomeLayout = ({ children }) => {
  const auth = useAuth();

  return (
    <BlankLayoutWrapper className='layout-wrapper'>
      <Box className='app-content' sx={{ minHeight: '100vh', position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            p: 6,
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Typography variant='h1' sx={{ mb: 2 }}>
            Auction
          </Typography>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center', justifyContent: ['center', 'space-between'] }}>
            {
              !auth.user ?
                <>
                  <LinkStyled sx={{ ml: 3 }} href="/login">Sign in</LinkStyled>
                  <LinkStyled sx={{ ml: 3 }} href="/register">Sign up</LinkStyled>
                </>
                :
                <>
                  <LinkStyled sx={{ ml: 3 }} href="/auction/create" >Create Auction</LinkStyled>
                  <LinkStyled sx={{ ml: 3 }} href="#" onClick={auth.logout}>Sign out</LinkStyled>
                </>
            }
          </Box>
        </Box>
        {children}
      </Box>
    </BlankLayoutWrapper>
  )
}

export default HomeLayout
