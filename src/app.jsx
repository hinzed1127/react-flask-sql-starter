import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const drawerWidth = 320;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    margin: "auto",
    width: "100px",
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  textField: {
    maxWidth: "40%",
    marginRight: theme.spacing.unit / 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

function Loader(props) {
  const {classes} = props;
  return (
    <div className={classes.progressContainer}>
      <CircularProgress className={classes.progress} size={50} />
    </div>
  );
}

function Contact(props) {
  return (
    <ListItem button onClick={() => props.onClick(props.id, false)}>
      <Avatar>
        <PersonIcon />
      </Avatar>
      <ListItemText primary={props.name} />
      <ListItemSecondaryAction>
        <IconButton onClick={() => props.onClick(props.id, true)}>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function DisplayContact(props) {
  const {classes, loading, contact, editMode, handleRename, handleAdd, handleRemove, handleEdit, handleDelete, handleSave} = props;
  
  if (loading) {
    return (
      <Loader classes={classes} />
    )
  }
  
  if (!contact) {
    return (
      <Typography noWrap>{`No contact selected`}</Typography>
    )
  }
  
  return (
    <div>
      <div>
        <TextField
          id="name"
          label="Name"
          value={contact.name}
          margin="normal"
          onChange={handleRename}
        />
      </div>
      {
        contact.voices.map(({id, type, value}, pos) => (
          <DisplayVoice
            classes={classes}
            key={id}
            type={type}
            value={value}
            pos={pos}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
            editMode={editMode}
          />
        ))
      }
      {
        editMode && (
          <div>
            <IconButton
              color="inherit"
              onClick={() => props.handleAdd()}
            >
              <AddCircleIcon />
            </IconButton>
          </div>
        )
      }
      {
        editMode && (
          <div>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )
      }
    </div>
  );
}

function DisplayVoice(props) {
  return (
    <div>
      <TextField
        className={props.classes.textField}
        id="type"
        value={props.type}
        margin="normal"
        onChange={(event) => props.handleEdit(props.pos, "type", event.target.value)}
      />
      <TextField
        className={props.classes.textField}
        id="value"
        value={props.value}
        margin="normal"
        onChange={(event) => props.handleEdit(props.pos, "value", event.target.value)}
      />
      {
        props.editMode && (
          <IconButton
            color="inherit"
            onClick={() => props.handleRemove(props.pos)}
          >
            <RemoveCircleIcon />
          </IconButton>
        )
      }
    </div>
  );
}

function pause (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      loading: true,
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDisplayContact = this.handleDisplayContact.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleNewContact = this.handleNewContact.bind(this);
    this.fetchContacts();
  }
  
  async fetchContacts() {
    const res = await fetch("/app/contacts");
    const contacts = await res.json();
    this.setState({
      loading: false,
      contacts,
    });
  };

  handleDrawerToggle() {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  
  async handleDisplayContact(id, editMode) {
    this.setState({
      mobileOpen: false,
      editMode,
      contactLoading: true,
    });

    const res = await fetch(`/app/contacts/${id}`);
    const contact = await res.json();
    
    this.setState({
      contactLoading: false,
      selectedContact: contact,
    });
  };
  
  handleRename(event) {
    if (this.state.editMode) {
      const contact = this.state.selectedContact;
      contact.name = event.target.value;
      this.setState({
        selectedContact: contact,
      });
    }
  };
  
  handleEdit(index, field, value) {
    if (this.state.editMode) {
      const contact = this.state.selectedContact;
      const voice = contact.voices[index];
      voice[field] = value;
      this.setState({
        selectedContact: contact,
      });
    }
  };
  
  handleAdd() {
    if (this.state.editMode) {
      const contact = this.state.selectedContact;
      contact.voices.push({
        id: contact.voices.length + 10,
        type: "",
        value: "",
      });
      this.setState({
        selectedContact: contact,
      });
    }
  };
  
  handleRemove(index) {
    if (this.state.editMode) {
      const contact = this.state.selectedContact;
      contact.voices.splice(index, 1);
      this.setState({
        selectedContact: contact,
      });
    }
  };
  
  async handleSave() {
    this.setState({
      loading: true,
      editMode: false,
    });
    await fetch(`/app/contacts/${this.state.selectedContact.id}`, {
      method: 'post',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(this.state.selectedContact),
    });
    await this.fetchContacts();
  };
  
  async handleDelete() {
    const id = this.state.selectedContact.id;
    this.setState({
      loading: true,
      editMode: false,
      selectedContact: null,
    });
    await fetch(`/app/contacts/${id}`, {
      method: 'delete',
      headers: {
        "Content-type": "application/json",
      },
    });
    await this.fetchContacts();
  };
  
  async handleNewContact() {
    this.setState({
      loading: true,
      editMode: false,
    });
    const res = await fetch(`/app/contacts`, {
      method: 'post',
      headers: {
        "Content-type": "application/json",
      },
    });
    const contact = await res.json();
    await this.fetchContacts();
    await this.handleDisplayContact(contact.id, true);
  };

  render() {
    const { classes, theme } = this.props;
    
    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.handleNewContact}>
            New contact
          </Button>
        </div>
        <Divider />
        {
          this.state.loading 
            ? 
          <Loader classes={classes} />
            :
          <List component="nav">
            {
              this.state.contacts.map(({id, name}) => (
                <Contact key={id} id={id} name={name} onClick={this.handleDisplayContact} />
              ))
            }
          </List>
        }
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Contacts
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <DisplayContact
            classes={classes}
            contact={this.state.selectedContact}
            loading={this.state.contactLoading}
            editMode={this.state.editMode}
            handleRename={this.handleRename}
            handleEdit={this.handleEdit}
            handleAdd={this.handleAdd}
            handleRemove={this.handleRemove}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
