
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { parseISO, format } from 'date-fns';

import toast from 'react-hot-toast'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import AuctionSlider from 'src/views/pages/home/AuctionSlider'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'


import CustomChip from 'src/@core/components/mui/chip'
import AuctionBids from 'src/views/pages/home/AuctionBids'
import HomeLayout from 'src/@core/layouts/HomeLayout'

import authConfig from 'src/configs/auth'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1600,
    width: '100%',
    margin: '0 auto',
  },
}));

const status = [
  'Upcoming',
  'Live',
  'LivePreserveMet',
  'Sold',
  'Expired',
  'ReserveNotMet',
];

const AuctionDetail = () => {
  const [data, setData] = useState();
  const router = useRouter();

  const { id } = router.query;
  const classes = useStyles();

  useEffect(() => {

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auction/detail/${id}`)
      .then((response) => {
        const res = response.data;
        if (res.status && res.data) {
          setData(res.data);
        }
      });
  }, [])

  const action = (price) => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auction/bid/${id}`,
      { price },
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        const { status, message, data } = res.data;
        if (status == "success" && data) {
          router.reload();
        } else {
          toast.error(message)
        }
      })
  }

  const chipColor = status => {
    switch (status) {
      case 0:
        return "warning";
      case 1:
      case 2:
        return "info";
      case 3:
        return "success";
      default:
        return "error";
    }
  }

  return (
    data && data.id &&
    <Container className={classes.container}>
      <Grid sx={{ m: 8 }}>
        <Typography variant='h1' sx={{ mb: 2 }}>
          {data.description}
        </Typography>
        <Grid container spacing={12}>
          <Grid item xs={12} sm={6} md={6}>
            <Grid sx={{ mb: 4 }}>
              <AuctionSlider images={data.images} />
            </Grid>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#007BB6' }}>
              <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                <Typography
                  variant='h3'
                  sx={{ display: 'flex', mb: 2.75, alignItems: 'center', color: 'common.white', '& svg': { mr: 2.5 } }}
                >
                  <Icon icon='tabler:info-square-rounded' />
                  Auction Info
                </Typography>
                <Typography
                  variant='h4'
                  sx={{ display: 'flex', mb: 2.75, alignItems: 'center', color: '#00bb00', '& svg': { mr: 2.5 } }}>
                  <Icon icon='tabler:file-description' />
                  {data.description}
                </Typography>
                <Typography
                  variant='h4'
                  sx={{ display: 'flex', mb: 2.75, alignItems: 'center', color: '#00bb00', '& svg': { mr: 2.5 } }}>
                  <Icon fontSize='1.25rem' icon='tabler:calendar' />
                  {' Period: '}
                  {format(parseISO(data.started_at), 'MM-dd HH:mm')} ~
                  {format(parseISO(data.ended_at), 'MM-dd HH:mm')}
                </Typography>
                <Box sx={{ m: 3 }}>
                  <Typography sx={{ mb: 3, color: 'common.white' }}>
                    Starting Price: {data.starting_price} USD
                  </Typography>
                  {
                    data.status != 0 &&
                    <Typography sx={{ mb: 3, color: 'common.white' }}>
                      Count of Bids: {data.auctionbids.length == 0 ? '--' : data.auctionbids.length}
                    </Typography>
                  }
                  <Typography sx={{ mb: 3, color: 'common.white' }}>
                    Highest Bid: {data.highest_price == 0 ? '--' : data.highest_price} USD
                  </Typography>
                  {/* <Typography sx={{ mb: 3, color: 'common.white' }}>
                  Winner: {data.winner.fullname}
                </Typography> */}
                  <Typography sx={{ mb: 8, color: 'common.white' }}>
                    <CustomChip rounded size='medium' skin='dark' color={chipColor(data.status)} label={status[data.status]} />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar alt='Mihkel Poder' src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data.seller.image}`} sx={{ width: 34, height: 34, mr: 2.75 }} />
                    <Typography sx={{ color: 'common.white' }}>{data.seller.fullname}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5, '& svg': { mr: 1.25 } }}>
                      <Icon icon='tabler:heart' />
                      <Typography sx={{ color: 'common.white' }}>1.1k</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.25 } }}>
                      <Icon icon='tabler:share' />
                      <Typography sx={{ color: 'common.white' }}>67</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AuctionBids
              data={data.auctionbids}
              starting={data.starting_price}
              highest={data.highest_price}
              action={action} />
          </Grid>
        </Grid>

      </Grid>
    </Container>
  );
}

AuctionDetail.getLayout = page => <HomeLayout>{page}</HomeLayout>
AuctionDetail.guestGuard = true

export default AuctionDetail
