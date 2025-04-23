"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);

  const handleDeleteTodo = (index: number) => {
    setTodoToDelete(index);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (todoToDelete !== null) {
      setTodos(todos.filter((_, i) => i !== todoToDelete));
      setConfirmOpen(false);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTodo, setCurrentTodo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setCurrentTodo(todos[index]);
    } else {
      setEditingIndex(null);
      setCurrentTodo("");
    }
    setOpenDialog(true);
  };

  const handleSaveTodo = () => {
    if (currentTodo.trim()) {
      if (editingIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editingIndex] = currentTodo;
        setTodos(updatedTodos);
      } else {
        setTodos([...todos, currentTodo]);
      }
      setOpenDialog(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this todo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingIndex !== null ? "Edit Todo" : "Add New Todo"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            value={currentTodo}
            onChange={(e) => setCurrentTodo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTodo}>Save</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo List
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Add Todo
          </Button>
        </Box>

        <List>
          {todos.map((todo, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <Button onClick={() => handleOpenDialog(index)}>Edit</Button>
                  <Button color="error" onClick={() => handleDeleteTodo(index)}>
                    Delete
                  </Button>
                </>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Checkbox edge="start" />
                </ListItemIcon>
                <ListItemText primary={todo} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
