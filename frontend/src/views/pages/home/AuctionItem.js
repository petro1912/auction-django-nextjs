// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { parseISO, format } from 'date-fns';

const SellerPhoto = styled('img')(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const AuctionItem = props => {
  // ** State
  const data = props.data;

  return data !== null ? (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={`${process.env.NEXT_PUBLIC_MEDIA_URL}/media${data.images[0].trim()}`}
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: 2,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <SellerPhoto src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data.seller.image}`} alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {data.fullName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.info' } }}>
                <Icon fontSize='1.25rem' icon='tabler:balloon' />
                <Typography sx={{ color: 'text.info' }}>Starting Price: {data.starting_price}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.info' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.info' }}>Started: {format(parseISO(data.started_at), 'MM-dd HH:mm')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.info' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.info' }}>Ended: {format(parseISO(data.ended_at), 'MM-dd HH:mm')}</Typography>
              </Box>
            </Box>
          </Box>
          {
            (data.status == 1 || data.status == 2) ?
              <Button variant='contained' color='info' sx={{ '& svg': { mr: 2 } }}>
                Bid
              </Button>
              :
              data.status == 0 ?
                <CustomChip rounded size='medium' skin='light' color='warning' label="Not Active" />
                :
                data.status == 3 ?
                  <CustomChip rounded size='medium' skin='light' color='info' label="Sold" />
                  :
                  data.status == 4 ?
                    <CustomChip rounded size='medium' skin='light' color='error' label="Expired" />
                    :
                    data.status == 5 ?
                      <CustomChip rounded size='medium' skin='light' color='error' label="Not Met" />
                      :
                      <></>
          }
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default AuctionItem
