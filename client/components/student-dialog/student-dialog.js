import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

//needs to be stateless
class StudentDialog extends Component {

  state = {
    value : null
  };

  handleChange = (e, ind, value) => {
    this.setState({ value });
  }

  handleSubmit = () => {
    const intervention = {
      school  : this.props.student.school._id,
      student : this.props.student._id,
      type    : this.state.value.title
    };

    this.props.dialogSubmit(this.props.student._id, intervention);

    this.props.dialogClose();
  }

  getMenuItems = () => this.props.data.map((interventionType, i) =>
      <MenuItem key={i}
        value={interventionType}
        primaryText={interventionType.title} />)

  render() {
    const actions = [
      <FlatButton key={0}
        label="Cancel"
        primary
        onTouchTap={this.props.dialogClose}
      />,
      <FlatButton key={1}
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.handleSubmit}
      />
    ];

    return (
      <div>
        <Dialog
          title="Create Intervention"
          actions={actions}
          modal={false}
          open={this.props.dialogOpen}
          onRequestClose={this.props.dialogClose}>
          <SelectField
            floatingLabelText="Intervention Type"
            value={this.state.value}
            onChange={this.handleChange}>
            {this.getMenuItems()}
          </SelectField>
        </Dialog>
      </div>
    );
  }
}

StudentDialog.propTypes = {
  data         : PropTypes.object,
  dialogOpen   : PropTypes.bool,
  dialogClose  : PropTypes.func,
  dialogSubmit : PropTypes.func,
  student      : PropTypes.object
};

export default StudentDialog;
