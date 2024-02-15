import HomeLayout from 'src/@core/layouts/HomeLayout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Card, CardContent } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import axios from 'axios'
import authConfig from 'src/configs/auth'

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1600,
    width: '100%',
    margin: '0 auto',
  },
}));

const Profile = () => {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const auth = useAuth();
  const router = useRouter();
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    console.log('user', auth);
    if (auth.user === null && !window.localStorage.getItem('userData')) {
      router.replace("/home");
    } else {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      console.log(storedToken);
      axios
        .get(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          }
        })
        .then((res) => {
          const data = res.data
          const { message, userData } = data
          console.log(userData)
          if (message == 'Authenticated') {
            setUser(userData)
          }
        })
    }


  }, [])


  return (
    auth.user != null && user &&
    <Container className={classes.container}>
      <Grid container sx={{ pl: 8, pr: 8, pb: 8 }}>
        <Typography variant='h2' sx={{ mb: 8, color: '#00ccdd' }}>
          Account Info
        </Typography>
        <Grid container spacing={6} sx={{ mb: 12 }}>
          <Card sx={{ border: 0, boxShadow: 0, color: 'common.white' }}>
            <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
              <Box>
                <h4>Full name: {user.fullname}</h4>
                <h4>Email: {user.email}</h4>
                <h4>Date joined: {user.date_joined}</h4>
                <h4>Email verified: None</h4>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Typography variant='h2' sx={{ mb: 8, color: '#00ccdd' }}>
          My Auctions
        </Typography>

      </Grid>
    </Container>
  )
}

Profile.getLayout = page => <HomeLayout>{page}</HomeLayout>
Profile.guestGuard = true

export default Profile
