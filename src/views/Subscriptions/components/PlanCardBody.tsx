import ISubscriptionPlan from '../../../interfaces/ISubscriptionPlan';
import { Dictionary, DictionaryService } from '../../../services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface CardPlanBodyProps {
  plan: ISubscriptionPlan;
}

const CardPlanBody: React.FC<CardPlanBodyProps> = ({plan}) => {
  return (
    <ul>
      {
        [
          [DictionaryService.keys.editorCustomization],
          [DictionaryService.keys.viewerCustomization],
          [DictionaryService.keys.includedAPICalls, `(${(plan.price / plan.unitPrice).toFixed(0)})`],
          [DictionaryService.keys.additionalAPICalls, `($${plan.unitPrice} cost per call)`]
        ].map((item) => (
          <Typography key={item[0]} variant="caption" component="li">
            {Dictionary.value(item[0])}
            {
              item[1] !== undefined && (
                <>
                  {' '}
                  <b>{item[1]}</b>
                </>
              )
            }
          </Typography>
        ))
      }
    </ul>
  )
}

export default CardPlanBody;
