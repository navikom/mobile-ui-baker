import React from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { AttachMoney } from '@material-ui/icons';
import { blackOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import useStyles from 'assets/jss/material-dashboard-react/views/cardStyle';
import ISubscriptionPlan from 'interfaces/ISubscriptionPlan';
import CardBody from 'components/Card/CardBody';
import CardPlanBody from './PlanCardBody';
import { makeStyles, Theme } from '@material-ui/core';

const extraStyles = makeStyles((theme: Theme) => ({
  card: {
    cursor: 'pointer',
  }
}));

interface UpdatePlanCardProps {
  plan: ISubscriptionPlan;
  selected: boolean;
  onClick: () => void;
}

const UpdatePlanCard: React.FC<UpdatePlanCardProps> = ({ plan, selected, onClick }) => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const contentStyle = classNames({
    [classes.cardTitleBlack]: !selected,
    [classes.cardTitleWhite]: selected,
  })
  return (
    <Grid item xs={12} sm={4} md={4}>
      <Card onClick={onClick} className={extraClasses.card}>
        <CardHeader color={selected ? 'primary' : 'inherit'} plain>
          <Typography variant="h3" align="center" className={contentStyle}>
            {plan.title}
          </Typography>
          <Grid container justify="center">
            <AttachMoney style={{ color: selected ? whiteOpacity(0.8) : blackOpacity(0.5) }} />
            <Typography variant="h2" align="center" className={contentStyle}>
              <b>{plan.price}</b>
            </Typography>
          </Grid>
          <Typography align="center" className={contentStyle}>
            {Dictionary.defValue(DictionaryService.keys.perMonth)}
          </Typography>
        </CardHeader>
        <CardBody>
          <CardPlanBody plan={plan} />
        </CardBody>
      </Card>
    </Grid>
  )
}

export default UpdatePlanCard;
