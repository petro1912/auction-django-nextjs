// ** MUI Imports
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CustomTextField from 'src/@core/components/mui/text-field'
import Button from '@mui/material/Button';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import FileUploaderRestrictions from 'src/views/uploads/FileUploaderRestrictions';
import { Typography } from '@mui/material';


const AuctionItem = ({ idx, values, updateInfo, removeItem }) => {

  const [data, setData] = useState({
    description: '',
    categories: '',
    starting_price: '',
    reserve_price: '',
    highest_price: 0,
    images: []
  });

  useEffect(() => {
    setData(values);
  }, [values])

  const [errors, setErrors] = useState({});

  const imagesUpdated = (files) => {
    console.log(files);
    updateInfo(idx, 'images', files);
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: null });
    updateInfo(idx, name, value);
  }

  const onBlur = (event) => {
    const { name, value } = event.target;
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateInput = (name, value) => {
    let error = null;
    if (!value.trim()) {
      error = `${name} is required`;
    }

    return error;
  }

  const remove = () => {
    removeItem(idx);
  }

  return (
    <Card>
      <CardHeader title={`Auction Item - ${idx + 1}`} />
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <CustomTextField
            fullWidth
            autoFocus
            name='description'
            label='Description'
            value={data.description}
            onBlur={onBlur}
            onChange={onChange}
            placeholder='description'
            error={Boolean(errors.description)}
            {...(errors.description && { helperText: errors.description.message })}
          />

        </Box>
        <Box sx={{ mb: 4 }}>
          <CustomTextField
            fullWidth
            autoFocus
            name='categories'
            label='Categories'
            value={data.categories}
            onBlur={onBlur}
            onChange={onChange}
            placeholder='category'
            error={Boolean(errors.categories)}
            {...(errors.categories && { helperText: errors.categories.message })}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <CustomTextField
            fullWidth
            autoFocus
            name='starting_price'
            label='Starting Price'
            value={data.starting_price}
            onBlur={onBlur}
            onChange={onChange}
            placeholder='USD'
            error={Boolean(errors.starting_price)}
            {...(errors.starting_price && { helperText: errors.starting_price.message })}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <CustomTextField
            fullWidth
            autoFocus
            name='reserve_price'
            label='Reserve Price'
            value={data.reserve_price}
            onBlur={onBlur}
            onChange={onChange}
            placeholder='USD'
            error={Boolean(errors.reserve_price)}
            {...(errors.reserve_price && { helperText: errors.reserve_price.message })}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant='h6'>Photos</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <DropzoneWrapper>
            <FileUploaderRestrictions
              values={data.images}
              updateCallback={imagesUpdated}
            />
          </DropzoneWrapper>
        </Box>

      </CardContent>
      <CardActions>
        <Button onClick={remove}>Remove</Button>
      </CardActions>
    </Card>

  );

}

export default AuctionItem;
