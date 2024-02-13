import { useState } from "react";

import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

import authConfig from 'src/configs/auth'
import HomeLayout from "src/@core/layouts/HomeLayout";
import AuctionInfo from "src/views/pages/auction/create/AuctionInfo";
import AuctionItem from "src/views/pages/auction/create/AuctionItem";
import axios from "axios";
import toast from 'react-hot-toast'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { useRouter } from "next/router";

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1600,
    width: '100%',
    margin: '0 auto',
  },
}));

const AuctionCreate = () => {
  const [actItems, setActItems] = useState([]);
  const router = useRouter();
  const classes = useStyles();

  const [period, setPeriod] = useState({
    started: new Date(),
    ended: new Date(),
  });

  const saveAuction = () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    if (!storedToken) {
      toast.error("you must log in at first");

      return;
    }
    if (actItems && actItems.length) {
      const items = [...actItems];

      const formData = new FormData();
      for (let index in items) {
        const act = items[index];
        act.started = period.started;
        act.ended = period.ended;
        if (act.ended.getTime() <= act.started.getTime()) {
          toast.error("Ended Time must be later than started time.");

          return;
        }

        if (!act.description) {
          toast.error("Description must not be empty.");

          return;
        }

        if (!act.reserve_price && act.reserve_price <= act.starting_price) {
          toast.error("Reserve Price must be greater than starting price.");

          return;
        }

        const images = [...act.images];
        delete act.images

        formData.append(`items[${index}]`, JSON.stringify(act))
        for (let idx in images) {
          formData.append(`images[${index}_${idx}]`, images[idx]);
        }
      }

      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auction/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type as multipart/form-data,
            'Authorization': `Bearer ${storedToken}`,
          }
        }
      )
        .then((res) => {
          const data = res.data;
          if (data.created_items?.length) {
            toast.success("created auction successfully");
            router.replace("/home")
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      toast.error("You must add an item at least.");
    }

  }

  const addActItem = () => {
    setActItems([...actItems, {
      description: '',
      categories: '',
      starting_price: '',
      reserve_price: '',
      highest_price: 0,
      images: []
    }]);
  }

  const removeItem = (idx) => {
    setActItems(actItems.filter((_, index) => index !== idx));
  }

  const updateItemInfo = (idx, key, value) => {
    setActItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[idx] = { ...updatedItems[idx], [key]: value };

      return updatedItems;
    });
  }

  const updatePeriod = (isStart, date) => {
    const key = isStart ? 'started' : 'ended';
    setPeriod({ ...period, [key]: date });
  }

  return (
    <Container className={classes.container}>
      <Box sx={{ ml: 8, mr: 8, pb: 8 }}>
        <Box sx={{ mb: 6 }} >
          <Button
            onClick={saveAuction}
            variant='contained'>
            Save Auction
          </Button>
        </Box>
        <Box sx={{ mb: 6 }} >
          <DatePickerWrapper>
            <AuctionInfo
              period={period}
              updatePeriod={updatePeriod}
            />
          </DatePickerWrapper>
        </Box>
        <Box sx={{ mb: 4 }} >
          <Button
            onClick={addActItem}
            variant='contained'>
            Add Item
          </Button>
        </Box>
        <Grid container spacing={6} sx={{ mb: 4 }}>
          {
            actItems && actItems.map((act, index) => {
              return (
                <Grid
                  key={`item-${index}`}
                  item
                  xs={12} sm={6} md={4}>
                  <AuctionItem
                    idx={index}
                    values={act}
                    updateInfo={updateItemInfo}
                    removeItem={removeItem}
                  />
                </Grid>
              );
            })}
        </Grid>

      </Box>
    </Container>
  )
};

AuctionCreate.getLayout = page => <HomeLayout>{page}</HomeLayout>

// AuctionCreate.guestGuard = false;

export default AuctionCreate;
