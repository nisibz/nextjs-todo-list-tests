"use client";
import React, { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./db";
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
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import Ajv from "ajv";

const ajv = new Ajv();
const todoSchema = {
  type: "object",
  properties: {
    text: {
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
  },
  required: ["text"],
  additionalProperties: false,
};

const validateTodo = ajv.compile(todoSchema);

export default function Home() {
  const [todos, setTodos] = useState<
    Array<{ id: number; text: string; checked: boolean }>
  >([]);

  const handleDeleteTodo = (id: number) => {
    setTodoToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (todoToDelete !== null) {
      await deleteTodo(todoToDelete);
      const savedTodos = await getTodos();
      setTodos(savedTodos);
      setConfirmOpen(false);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ text: string }>({
    defaultValues: {
      text: "",
    },

    resolver: async (values) => {
      const trimmedValues = { text: values.text.trim() };
      const valid = validateTodo(trimmedValues);

      if (valid) {
        return {
          values: trimmedValues,
          errors: {} as FieldErrors<{ text: string }>,
        };
      }

      return {
        values: {},
        errors: (validateTodo.errors?.reduce(
          (acc, err) => ({
            ...acc,
            [err.instancePath.slice(1) || "text"]: {
              type: "validation",
              message: err.message,
            },
          }),
          {} as FieldErrors<{ text: string }>,
        ) || {
          text: {
            type: "required",
            message: "This field is required",
          },
        }) as FieldErrors<{ text: string }>,
      };
    },
  });

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await getTodos();
        console.log(savedTodos);
        setTodos(savedTodos);
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadTodos();
  }, []);

  const handleOpenDialog = (id?: number) => {
    if (id !== undefined) {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        setEditingId(id);
        reset({ text: todo.text });
      }
    } else {
      setEditingId(null);
      reset({ text: "" });
    }
    setOpenDialog(true);
  };

  const handleToggleCheck = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, checked: !todo.checked };
      await updateTodo(updatedTodo);
      const savedTodos = await getTodos();
      setTodos(savedTodos);
    }
  };

  const handleSaveTodo = handleSubmit(async (data) => {
    const processedText = data.text.trim();
    if (editingId !== null) {
      const todo = todos.find((t) => t.id === editingId);
      if (todo) {
        const updatedTodo = { ...todo, text: processedText };
        await updateTodo(updatedTodo);
      }
    } else {
      const newTodo = {
        id: Date.now(),
        text: processedText,
        checked: false,
      };
      await addTodo(newTodo);
    }
    const savedTodos = await getTodos();
    setTodos(savedTodos);
    setOpenDialog(false);
    reset();
  });

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
      <Dialog
        fullWidth
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        disableEnforceFocus
        TransitionProps={{
          onEntered: () => {
            const input = document.getElementById("todo-text-input");
            input?.focus();
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">
          {editingId !== null ? "Edit Todo" : "Add New Todo"}
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
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="todo-text-input"
                autoFocus
                margin="dense"
                label="Todo text"
                fullWidth
                variant="outlined"
                error={!!errors.text}
                helperText={errors.text?.message}
              />
            )}
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
                        onClick={() => handleOpenDialog(todo.id)}
                        aria-label="Edit"
                        color="warning"
                        sx={{ mr: 1 }}
                        disabled={todo.checked}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTodo(todo.id)}
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
                        onChange={() => handleToggleCheck(todo.id)}
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
