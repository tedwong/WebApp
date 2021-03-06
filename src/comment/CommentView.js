import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import timeOffsetStringInChinese from '../TimeString';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import geoString from '../GeoLocationString';

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 64,
        height: 64,
    },
});

class CommentView extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { classes, theme } = this.props;
    var c = this.props.comment;
    var text = c.text;
    if(text == null) {
        if(c.geolocation != null) {
            var locationString = null;
            if(c.streetAddress != null) {
                locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
              } else {
                locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);      
              } 
            text = "要求更改地點: " + locationString;
        } else {
            if(c.changeStatus != null) {
                text = "要求更改現況: " + c.changeStatus;
            } else {
                if(c.link != null) {
                    text = "要求更改外部連結: " + c.link;
                }
            }          
        }
    }
    var timeOffset = Date.now() - c.createdAt;
    var timeOffsetString = timeOffsetStringInChinese(timeOffset);
    var subtitle = '張貼於： ' + timeOffsetString + '前';
    return (<Card className={classes.card}>
                <CardMedia
                    className={classes.cover}
                    image={c.photoUrl}
                    title={c.name}
                />                 
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subheading">{text}</Typography>
                        <Typography variant="caption" color="textSecondary">
                        {subtitle}
                        </Typography>
                    </CardContent>
                </div>
            </Card>);
  }
}

CommentView.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
export default withStyles(styles, { withTheme: true })(CommentView);
