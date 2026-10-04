import { HTMLAttributes, ReactNode } from 'react';
import omit from '../../_util/omit';
import { Omit } from '../../_util/type';

interface SummaryCellProps extends Omit<HTMLAttributes<HTMLTableDataCellElement>, 'children'> {
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

function Cell(props: SummaryCellProps) {
  const { children, ...rest } = props;
  return <td {...omit(rest, ['$$SuzumeTableSummaryCell'])}>{children}</td>;
}

Cell.__SUZUME_TABLE_SUMMARY_CELL__ = true;

export default Cell;
