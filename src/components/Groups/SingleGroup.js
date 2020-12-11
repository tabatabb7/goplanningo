import React from "react";
import { connect } from "react-redux";
import { updateGroupThunk, fetchSingleGroup } from "../../store/singleGroup";
import { Link } from "react-router-dom";
import { addToGroupThunk, deleteFromGroupThunk } from "../../store/singleGroup";
import "./singlegroup.css";

class SingleGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchGroup(this.props.match.params.groupId);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  async handleSubmit(event) {
    event.preventDefault();
    try {
      await this.props.addUser(this.props.group.id, this.state.userId);
      this.props.fetchGroup(this.props.match.params.groupId);
    } catch (err) {
      console.log("handlesubmit err", err);
    }
  }

  render() {
    const group = this.props.group;

    return (
      <div key={group.id} id="group-info">
        Edit group
        <form id="addform" onSubmit={this.handleSubmit}>
          <h3>Add a User</h3>
          <label htmlFor="userId">id</label>
          <input
            name="userId"
            type="text"
            onChange={this.handleChange}
            value={this.props.userId}
          />
          <button type="submit">Submit</button>
        </form>
        <h1 className="tool-title">Group: {group.name}</h1>
        <img src={group.imageUrl}></img>
        <h3>Description: {group.description}</h3>
        <ul>
          <li>
            <Link to={`/groups/${this.props.group.id}/tasks`}>Group Tasks</Link>
          </li>
          <li>
            {" "}
            <Link to={`/groups/${this.props.group.id}/shoppinglist`}>
              Shopping
            </Link>
          </li>
          <li>
            <Link to={`/groups/${this.props.group.id}/rewards`}>Rewards</Link>
          </li>
        </ul>
        Users:
        {group.users ? (
          <div>
            {group.users.map((user) => (
              <div key={user.id}>
                <img src={user.avatarUrl} className="user-avatar" />
                {(() => {
                  if (user.User_Group.role === "admin") {
                    return (
                      <h3>
                        {user.firstName} {user.lastName} 🏅
                      </h3>
                    );
                  } else {
                    return (
                      <h3>
                        {user.firstName} {user.lastName}
                      </h3>
                    );
                  }
                })()}
              </div>
            ))}
          </div>
        ) : (
          "This group has no members."
        )}
      </div>
    );
  }
}

const mapState = (state) => ({
  group: state.singleGroup,
});

const mapDispatch = (dispatch) => ({
  fetchGroup: (group) => dispatch(fetchSingleGroup(group)),
  updateGroup: (group) => dispatch(updateGroupThunk(group)),
  addUser: (groupId, userId) => dispatch(addToGroupThunk(groupId, userId)),
});

export default connect(mapState, mapDispatch)(SingleGroup);