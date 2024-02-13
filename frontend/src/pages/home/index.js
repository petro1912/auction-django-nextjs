import { useState, useEffect } from 'react'
import Link from 'next/link'

import axios from 'axios'
import { styled } from '@mui/material/styles'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import HomeLayout from 'src/@core/layouts/HomeLayout'

import { makeStyles } from '@mui/styles'

import AuctionItem from 'src/views/pages/home/AuctionItem'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1600,
    width: '100%',
    margin: '0 auto',
  },
}));

const Home = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [activeItems, setActiveItems] = useState([]);
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  const classes = useStyles();

  useEffect(() => {

    axios.get(`${API_URL}/auction/list`)
      .then((response) => {
        const res = response.data;
        const { status, data } = res;
        if (status && data) {
          setActiveItems(
            data.filter((item) => item.status == 1 || item.status == 2)
          );
          setUpcomingItems(
            data.filter((item) => item.status == 0)
          );
          setCompletedItems(
            data.filter((item) => item.status > 2 && item.status < 6)
          );
        }

      })

  }, []);

  const gridAuctionItems = auctionItems => (
    auctionItems.map((data, index) => {
      return (
        <Grid key={`auction-${index}`} item xs={12} sm={6} md={4}>
          <LinkStyled href={`/auction/${data.id}`}>
            <AuctionItem data={data} />
          </LinkStyled>
        </Grid>
      )
    })
  );

  return (
    <Container className={classes.container}>
      <Grid container sx={{ pl: 8, pr: 8, pb: 8 }}>
        <Typography variant='h2' sx={{ mb: 2, color: '#00cc11' }}>
          Active
        </Typography>
        <Grid container spacing={6} sx={{ mb: 12 }}>
          {
            gridAuctionItems(activeItems)
          }
        </Grid>

        <Typography variant='h2' sx={{ mb: 2, color: '#cc1100' }}>
          Upcoming
        </Typography>
        <Grid container spacing={6} sx={{ mb: 12 }}>
          {
            gridAuctionItems(upcomingItems)
          }
        </Grid>

        <Typography variant='h2' sx={{ mb: 2, color: '#00ccdd' }}>
          Completed
        </Typography>
        <Grid container spacing={6} sx={{ mb: 12 }}>
          {
            gridAuctionItems(completedItems)
          }
        </Grid>
      </Grid>
    </Container>
  )
}

Home.getLayout = page => <HomeLayout>{page}</HomeLayout>
Home.guestGuard = true

export default Home
