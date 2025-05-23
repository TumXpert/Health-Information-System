"""Program Change with Status and Soft Delete

Revision ID: 5795a578fac2
Revises: 2df3eae1033e
Create Date: 2025-04-26 09:51:29.774663

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5795a578fac2'
down_revision = '2df3eae1033e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('program', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=50), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('program', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###
