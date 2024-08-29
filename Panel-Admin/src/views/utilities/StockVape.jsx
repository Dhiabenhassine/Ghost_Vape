import * as React from 'react';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const columns = [
  {
    field: 'NomVape',
    headerName: 'NomVape',
    width: 190,
    editable: true,
  },
  {
    field: 'PrixAchat',
    headerName: 'Prix Achat',
    width: 150,
    editable: true,
  },
  {
    field: 'QteStockVape',
    headerName: 'Qte Stock Vape',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Type',
    headerName: 'Type',
    width: 150,
    editable: true,
  },
  {
    field: 'created_at',
    headerName: 'Date de Vente',
    width: 200,
    editable: true,
  },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newVape, setNewVape] = useState({
    NomVape: '',
    PrixAchat: '',
    QteStockVape: '',
    Type: ''
  });
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/VapeController/selectAllVapes');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Vape || `id-${index}`,
        NomVape: row.NomVape || '',
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVape((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertVape = async () => {
    try {
      const { NomVape, PrixAchat, QteStockVape, Type } = newVape;
      await axios.post('http://127.0.0.1:4000/VapeController/insertVape', {
        NomVape, PrixAchat, QteStockVape, Type
      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.NomVape && row.NomVape.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ height: 700, width: '53%', marginLeft: '15%', background: 'white', marginTop: '3%' }}>
      <Box component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off">
        <TextField
          id="standard-basic"
          label="Search"
          variant="standard"
          value={search}
          onChange={handleSearch}
          sx={{ marginLeft: '2%', top: '2%' }}
        />
        <AddIcon sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }} onClick={() => setOpenModal(true)} />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Vape</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom Vape"
            name="NomVape"
            value={newVape.NomVape}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Achat"
            name="PrixAchat"
            value={newVape.PrixAchat}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Qte Stock Vape"
            name="QteStockVape"
            value={newVape.QteStockVape}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Type Vape</InputLabel>
            <Select
              label="Type Vape"
              name="Type"
              value={newVape.Type}
              onChange={handleInputChange}
              variant="outlined"
            >
              <MenuItem value="Puff">Puff</MenuItem>
              <MenuItem value="Vape">Vape</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertVape}>Add</Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ marginTop: '2%' }}
      />
    </Box>
  );
}
