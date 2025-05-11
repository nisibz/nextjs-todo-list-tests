"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const [todos, setTodos] = useState<Array<{ text: string; checked: boolean }>>(
    [],
  );

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Handle migration from old format (string array) to new format (object array)
        if (parsedData.length > 0 && typeof parsedData[0] === "string") {
          setTodos(
            parsedData.map((text: string) => ({ text, checked: false })),
          );
        } else {
          setTodos(parsedData);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setCurrentTodo(todos[index].text);
    } else {
      setEditingIndex(null);
      setCurrentTodo("");
    }
    setOpenDialog(true);
  };

  const handleToggleCheck = (index: number) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, checked: !todo.checked } : todo,
      ),
    );
  };

  const handleSaveTodo = () => {
    if (currentTodo.trim()) {
      if (editingIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editingIndex] = {
          text: currentTodo.trim(),
          checked: updatedTodos[editingIndex].checked, // Preserve existing checked state
        };
        setTodos(updatedTodos);
      } else {
        setTodos([{ text: currentTodo.trim(), checked: false }, ...todos]);
      }
      setOpenDialog(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Dialog
        fullWidth
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
          <IconButton
            aria-label="close"
            onClick={() => setConfirmOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this todo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle id="customized-dialog-title">
          {editingIndex !== null ? "Edit Todo" : "Add New Todo"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={currentTodo}
            onChange={(e) => setCurrentTodo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveTodo}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Todo List
          </Typography>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: { xs: "center", sm: "flex-end" },
              mb: 2,
            }}
          >
            <Button variant="contained" onClick={() => handleOpenDialog()}>
              Add Todo
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          <List>
            {todos.map((todo, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton
                        onClick={() => handleOpenDialog(index)}
                        aria-label="Edit"
                        color="warning"
                        sx={{ mr: 1 }}
                        disabled={todo.checked}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTodo(index)}
                        aria-label="Delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                  disablePadding
                  sx={{ py: 1.5 }}
                >
                  <ListItemButton
                    sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.checked}
                        onChange={() => handleToggleCheck(index)}
                        color="success"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={todo.text}
                      sx={{
                        textDecoration: todo.checked ? "line-through" : "none",
                        color: todo.checked ? "text.disabled" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < todos.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: 4,
            display: { xs: "flex", sm: "none" },
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Add Todo
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
